#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// -------- AP CONFIG --------
const char* ap_ssid = "SmartMeter_Node1";
const char* ap_password = "12345678";

// -------- SERVER --------
ESP8266WebServer server(80);

// -------- POT CONFIG --------
#define POT_PIN A0
const float MAX_CURRENT = 5.0;   // Simulated max current (A)
const float PEAK_THRESHOLD = 3.0;

// -------- VARIABLES --------
float currentValue = 0.0;
int rawADC = 0;
String loadStatus = "NORMAL";
unsigned long lastUpdate = 0;

// -------- FUNCTION DECLARATIONS --------
void setCORSHeaders();
void handleData();
void handleOptions();
void readPotentiometer();

// -------- READ POT --------
void readPotentiometer() {
  rawADC = analogRead(POT_PIN);   // 0–1023
  currentValue = (rawADC / 1023.0) * MAX_CURRENT;

  if (currentValue > PEAK_THRESHOLD) {
    loadStatus = "PEAK";
  } else {
    loadStatus = "NORMAL";
  }

  lastUpdate = millis();
}

// -------- CORS HEADERS --------
void setCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

// -------- API HANDLER --------
void handleData() {
  readPotentiometer();

  // Build JSON response matching dashboard expectations
  String json = "{";
  json += "\"current\": " + String(currentValue, 2) + ",";
  json += "\"raw_adc\": " + String(rawADC) + ",";
  json += "\"status\": \"" + loadStatus + "\",";
  json += "\"timestamp\": " + String(lastUpdate);
  json += "}";

  // Send CORS headers + JSON
  setCORSHeaders();
  server.send(200, "application/json", json);
}

// -------- OPTIONS HANDLER (for CORS preflight) --------
void handleOptions() {
  setCORSHeaders();
  server.send(204); // No Content
}

// -------- SETUP --------
void setup() {
  Serial.begin(115200);
  delay(100);

  // Start AP
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ap_ssid, ap_password);
  IPAddress ip = WiFi.softAPIP();

  Serial.println();
  Serial.println("========================================");
  Serial.println("ESP8266 Smart Meter AP Started");
  Serial.println("========================================");
  Serial.print("AP SSID: ");
  Serial.println(ap_ssid);
  Serial.print("AP IP Address: ");
  Serial.println(ip);
  Serial.println("========================================");

  // API Routes
  server.on("/data", HTTP_GET, handleData);
  server.on("/data", HTTP_OPTIONS, handleOptions);
  
  server.begin();

  Serial.println("HTTP server started");
  Serial.println("Endpoint: http://192.168.4.1/data");
  Serial.println("========================================");
  Serial.println("Ready! Connect to Wi-Fi: " + String(ap_ssid));
  Serial.println("========================================");
}

// -------- LOOP --------
void loop() {
  server.handleClient();
  // No delay needed - server.handleClient() is non-blocking
}
