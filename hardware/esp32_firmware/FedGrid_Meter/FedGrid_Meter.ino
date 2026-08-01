#include <HTTPClient.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <Wire.h>

namespace {

const int I2C_SDA = 21;
const int I2C_SCL = 22;
const int PIN_VOLTAGE = 34;
const int PIN_CURRENT = 35;
const int PIN_RELAY = 26;
const int PIN_BUZZER = 25;
const int PIN_LED_RED = 12;
const int PIN_LED_BLUE = 13;
const uint8_t LCD_ADDR = 0x27;

const bool USE_AP_MODE = true;
const char AP_SSID[] = "FedGrid-Node1";
const char AP_PASSWORD[] = "fedgrid123";
const char WIFI_SSID[] = "YOUR_WIFI_SSID";
const char WIFI_PASSWORD[] = "YOUR_WIFI_PASSWORD";
const char NODE_ID[] = "1";
const char LISTENER_URL[] = "http://192.168.4.2:5002/data";

const bool RELAY_ACTIVE_HIGH = true;
const bool RELAY_DEFAULT_ON = true;
const bool AUTO_TRIP_RELAY = false;

const float ADC_VREF = 3.3f;
const int ADC_MAX = 4095;
const int NUM_SAMPLES = 320;
const int SAMPLE_DELAY_US = 300;

float VOLTAGE_CAL = 95.0f;
float CURRENT_CAL = 1.0f;
const float ACS712_MV_PER_A = 185.0f;
const float EMA_ALPHA = 0.25f;

const float NO_LOAD_CURRENT_A = 0.03f;
const float WARN_CURRENT_A = 1.5f;
const float ALERT_CURRENT_A = 2.5f;
const float LOW_VOLTAGE_V = 180.0f;
const float HIGH_VOLTAGE_V = 250.0f;

const unsigned long LCD_ROTATE_MS = 2200;
const unsigned long SENSOR_REFRESH_MS = 750;
const unsigned long PUSH_INTERVAL_MS = 4000;
const unsigned long WIFI_RETRY_MS = 10000;
const unsigned long ALARM_BEEP_MS = 180;

LiquidCrystal_I2C lcd(LCD_ADDR, 16, 2);

enum class MeterState {
  Booting,
  NoLoad,
  Healthy,
  Warning,
  Alert,
  Offline,
};

struct Reading {
  float voltage;
  float current;
  float powerW;
  float energyWh;
};

Reading gReading = {0.0f, 0.0f, 0.0f, 0.0f};
MeterState gState = MeterState::Booting;
bool gRelayOn = RELAY_DEFAULT_ON;
bool gWifiConnectedOnce = false;
bool gAlarmLatched = false;
unsigned long gLastSensorMs = 0;
unsigned long gLastPushMs = 0;
unsigned long gLastWifiAttemptMs = 0;
unsigned long gLastLcdFlipMs = 0;
unsigned long gLastAlarmMs = 0;
int gPage = 0;

bool wifiLinkReady() {
  if (USE_AP_MODE) {
    return WiFi.getMode() == WIFI_AP || WiFi.getMode() == WIFI_AP_STA;
  }
  return WiFi.status() == WL_CONNECTED;
}

bool canPushToListener() {
  if (!wifiLinkReady()) {
    return false;
  }
  if (USE_AP_MODE) {
    return WiFi.softAPgetStationNum() > 0;
  }
  return true;
}

void setRelay(bool on) {
  gRelayOn = on;
  if (on) {
    gAlarmLatched = false;
  }
  digitalWrite(PIN_RELAY, (RELAY_ACTIVE_HIGH ? on : !on) ? HIGH : LOW);
}

bool parseDesiredRelayState(const String& body, bool* relayOn) {
  const int keyPos = body.indexOf("\"desired_relay_on\":");
  if (keyPos < 0) {
    return false;
  }
  const int valuePos = keyPos + 19;
  if (body.startsWith("true", valuePos)) {
    *relayOn = true;
    return true;
  }
  if (body.startsWith("false", valuePos)) {
    *relayOn = false;
    return true;
  }
  return false;
}

float readRmsAdc(int pin) {
  long sum = 0;
  int samples[NUM_SAMPLES];
  for (int i = 0; i < NUM_SAMPLES; i++) {
    samples[i] = analogRead(pin);
    sum += samples[i];
    delayMicroseconds(SAMPLE_DELAY_US);
  }

  const float avg = static_cast<float>(sum) / NUM_SAMPLES;
  float sumSq = 0.0f;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    const float delta = static_cast<float>(samples[i]) - avg;
    sumSq += delta * delta;
  }

  return sqrt(sumSq / NUM_SAMPLES);
}

float readVoltageRms() {
  const float rmsAdc = readRmsAdc(PIN_VOLTAGE);
  return (rmsAdc / static_cast<float>(ADC_MAX)) * ADC_VREF * VOLTAGE_CAL;
}

float readCurrentRms() {
  const float rmsAdc = readRmsAdc(PIN_CURRENT);
  const float vRms = (rmsAdc / static_cast<float>(ADC_MAX)) * ADC_VREF;
  const float amps = (vRms / (ACS712_MV_PER_A / 1000.0f)) * CURRENT_CAL;
  return amps > 0.0f ? amps : 0.0f;
}

const char* stateLabel(MeterState state) {
  switch (state) {
    case MeterState::Booting:
      return "BOOT";
    case MeterState::NoLoad:
      return "NO LOAD";
    case MeterState::Healthy:
      return "HEALTHY";
    case MeterState::Warning:
      return "WATCH";
    case MeterState::Alert:
      return "ALERT";
    case MeterState::Offline:
      return "OFFLINE";
  }
  return "UNKNOWN";
}

MeterState classifyState(const Reading& reading) {
  if (!wifiLinkReady() && gWifiConnectedOnce) {
    return MeterState::Offline;
  }
  if (reading.current < NO_LOAD_CURRENT_A) {
    return MeterState::NoLoad;
  }
  if (
      reading.current >= ALERT_CURRENT_A ||
      reading.voltage < LOW_VOLTAGE_V ||
      reading.voltage > HIGH_VOLTAGE_V) {
    return MeterState::Alert;
  }
  if (reading.current >= WARN_CURRENT_A) {
    return MeterState::Warning;
  }
  return MeterState::Healthy;
}

void beepAlarm() {
  if (millis() - gLastAlarmMs < 2000) {
    return;
  }
  gLastAlarmMs = millis();
  digitalWrite(PIN_BUZZER, HIGH);
  delay(ALARM_BEEP_MS);
  digitalWrite(PIN_BUZZER, LOW);
}

void updateOutputs() {
  const unsigned long tick = millis() / 350;
  switch (gState) {
    case MeterState::Booting:
      digitalWrite(PIN_LED_BLUE, tick % 2 ? HIGH : LOW);
      digitalWrite(PIN_LED_RED, LOW);
      break;
    case MeterState::NoLoad:
    case MeterState::Healthy:
      digitalWrite(PIN_LED_BLUE, HIGH);
      digitalWrite(PIN_LED_RED, LOW);
      break;
    case MeterState::Warning:
      digitalWrite(PIN_LED_BLUE, tick % 2 ? HIGH : LOW);
      digitalWrite(PIN_LED_RED, LOW);
      break;
    case MeterState::Alert:
      digitalWrite(PIN_LED_BLUE, LOW);
      digitalWrite(PIN_LED_RED, tick % 2 ? HIGH : LOW);
      beepAlarm();
      if (AUTO_TRIP_RELAY && !gAlarmLatched) {
        setRelay(false);
        gAlarmLatched = true;
      }
      break;
    case MeterState::Offline:
      digitalWrite(PIN_LED_BLUE, tick % 2 ? HIGH : LOW);
      digitalWrite(PIN_LED_RED, tick % 2 ? LOW : HIGH);
      break;
  }
}

void renderPage0() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("V:");
  lcd.print(gReading.voltage, 1);
  lcd.print(" I:");
  lcd.print(gReading.current, 2);
  lcd.setCursor(0, 1);
  lcd.print("Node1 ");
  lcd.print(stateLabel(gState));
}

void renderPage1() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("P:");
  lcd.print(gReading.powerW, 1);
  lcd.print("W");
  lcd.setCursor(0, 1);
  lcd.print("E:");
  lcd.print(gReading.energyWh, 2);
  lcd.print("Wh");
}

void renderPage2() {
  lcd.clear();
  lcd.setCursor(0, 0);
  if (USE_AP_MODE) {
    lcd.print("AP ");
    lcd.print(WiFi.softAPIP());
  } else if (WiFi.status() == WL_CONNECTED) {
    lcd.print("WiFi ");
    lcd.print(WiFi.RSSI());
    lcd.print("dBm");
  } else {
    lcd.print("WiFi reconnect");
  }
  lcd.setCursor(0, 1);
  if (USE_AP_MODE) {
    lcd.print("STA:");
    lcd.print(WiFi.softAPgetStationNum());
    lcd.print(" R:");
    lcd.print(gRelayOn ? "ON" : "OFF");
  } else {
    lcd.print("Relay:");
    lcd.print(gRelayOn ? "ON " : "OFF");
    lcd.print(" ID:");
    lcd.print(NODE_ID);
  }
}

void updateLcd() {
  if (millis() - gLastLcdFlipMs >= LCD_ROTATE_MS) {
    gLastLcdFlipMs = millis();
    gPage = (gPage + 1) % 3;
  }

  switch (gPage) {
    case 0:
      renderPage0();
      break;
    case 1:
      renderPage1();
      break;
    default:
      renderPage2();
      break;
  }
}

void connectWifiIfNeeded() {
  if (USE_AP_MODE) {
    if (wifiLinkReady()) {
      gWifiConnectedOnce = true;
      return;
    }
    if (millis() - gLastWifiAttemptMs < WIFI_RETRY_MS) {
      return;
    }
    gLastWifiAttemptMs = millis();
    WiFi.mode(WIFI_AP);
    if (WiFi.softAP(AP_SSID, AP_PASSWORD)) {
      gWifiConnectedOnce = true;
    }
    return;
  }
  if (WiFi.status() == WL_CONNECTED) {
    gWifiConnectedOnce = true;
    return;
  }
  if (millis() - gLastWifiAttemptMs < WIFI_RETRY_MS) {
    return;
  }
  gLastWifiAttemptMs = millis();
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void pushReading() {
  if (!canPushToListener() || millis() - gLastPushMs < PUSH_INTERVAL_MS) {
    return;
  }
  gLastPushMs = millis();

  HTTPClient http;
  http.setTimeout(2500);
  http.begin(LISTENER_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"node_id\":\"" + String(NODE_ID) + "\",";
  payload += "\"voltage\":" + String(gReading.voltage, 2) + ",";
  payload += "\"current\":" + String(gReading.current, 3) + ",";
  payload += "\"power_w\":" + String(gReading.powerW, 2) + ",";
  payload += "\"energy_wh\":" + String(gReading.energyWh, 3) + ",";
  payload += "\"status\":\"" + String(stateLabel(gState)) + "\",";
  payload += "\"relay_on\":" + String(gRelayOn ? "true" : "false") + ",";
  payload += "\"rssi\":" + String(WiFi.RSSI());
  payload += "}";

  const int code = http.POST(payload);
  if (code > 0) {
    const String body = http.getString();
    bool desiredRelayOn = gRelayOn;
    if (parseDesiredRelayState(body, &desiredRelayOn) && desiredRelayOn != gRelayOn) {
      setRelay(desiredRelayOn);
    }
  } else {
    gState = MeterState::Offline;
  }
  http.end();
}

void sampleSensors() {
  if (millis() - gLastSensorMs < SENSOR_REFRESH_MS) {
    return;
  }

  const unsigned long now = millis();
  const float dtHours = gLastSensorMs == 0 ? 0.0f : static_cast<float>(now - gLastSensorMs) / 3600000.0f;
  gLastSensorMs = now;

  const float rawVoltage = readVoltageRms();
  const float rawCurrent = readCurrentRms();

  if (gReading.voltage <= 0.01f) {
    gReading.voltage = rawVoltage;
    gReading.current = rawCurrent;
  } else {
    gReading.voltage = (EMA_ALPHA * rawVoltage) + ((1.0f - EMA_ALPHA) * gReading.voltage);
    gReading.current = (EMA_ALPHA * rawCurrent) + ((1.0f - EMA_ALPHA) * gReading.current);
  }

  gReading.powerW = gReading.voltage * gReading.current;
  gReading.energyWh += gReading.powerW * dtHours;
  gState = classifyState(gReading);
}

}  // namespace

void setup() {
  Serial.begin(115200);
  delay(100);

  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_BLUE, OUTPUT);
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_LED_RED, LOW);
  digitalWrite(PIN_LED_BLUE, LOW);
  setRelay(RELAY_DEFAULT_ON);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  Wire.begin(I2C_SDA, I2C_SCL);
  lcd.init();
  delay(100);
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("FedGrid Meter");
  lcd.setCursor(0, 1);
  lcd.print("Booting...");

  gState = MeterState::Booting;
  connectWifiIfNeeded();
}

void loop() {
  connectWifiIfNeeded();
  sampleSensors();
  updateOutputs();
  updateLcd();
  pushReading();

  Serial.printf(
      "[Node %s] V=%.1fV I=%.3fA P=%.2fW E=%.3fWh state=%s wifi=%s relay=%s\n",
      NODE_ID,
      gReading.voltage,
      gReading.current,
      gReading.powerW,
      gReading.energyWh,
      stateLabel(gState),
      canPushToListener() ? "up" : "down",
      gRelayOn ? "on" : "off");

  delay(50);
}
