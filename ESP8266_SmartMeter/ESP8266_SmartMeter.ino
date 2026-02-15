#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// -------- WIFI CONFIG (Station Mode - Connect to Router) --------
const char* wifi_ssid = "Airtelontopp";
const char* wifi_password = "estancia3071";

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
  delay(1000); // Give serial time to initialize

  Serial.println();
  Serial.println("========================================");
  Serial.println("ESP8266 Smart Meter - Starting...");
  Serial.println("========================================");

  // Configure Wi-Fi settings
  WiFi.mode(WIFI_STA);
  WiFi.setAutoConnect(true);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);

  // Connect to Wi-Fi
  Serial.print("SSID: ");
  Serial.println(wifi_ssid);
  Serial.print("Password: ");
  Serial.println("********"); // Don't print actual password
  Serial.println("Connecting to Wi-Fi...");

  WiFi.begin(wifi_ssid, wifi_password);

  // Wait for connection with longer timeout
  int attempts = 0;
  int maxAttempts = 60; // 30 seconds total

  while (WiFi.status() != WL_CONNECTED && attempts < maxAttempts) {
    delay(500);
    Serial.print(".");
    attempts++;
    
    // Print status every 10 attempts
    if (attempts % 10 == 0) {
      Serial.println();
      Serial.print("Status: ");
      Serial.println(WiFi.status());
      Serial.print("Attempts: ");
      Serial.print(attempts);
      Serial.print("/");
      Serial.println(maxAttempts);
    }
  }

  Serial.println();
  Serial.println();

  // Check connection result
  if (WiFi.status() == WL_CONNECTED) {
    IPAddress ip = WiFi.localIP();
    Serial.println("========================================");
    Serial.println("✅ CONNECTED TO WI-FI!");
    Serial.println("========================================");
    Serial.print("IP Address: ");
    Serial.println(ip);
    Serial.print("Gateway: ");
    Serial.println(WiFi.gatewayIP());
    Serial.print("Subnet: ");
    Serial.println(WiFi.subnetMask());
    Serial.print("Signal Strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    Serial.print("MAC Address: ");
    Serial.println(WiFi.macAddress());
    Serial.println("========================================");
  } else {
    Serial.println("========================================");
    Serial.println("❌ FAILED TO CONNECT TO WI-FI!");
    Serial.println("========================================");
    Serial.print("Wi-Fi Status Code: ");
    Serial.println(WiFi.status());
    Serial.println("");
    Serial.println("Possible issues:");
    Serial.println("  1. Wrong SSID (case-sensitive)");
    Serial.println("  2. Wrong password");
    Serial.println("  3. Router not in range");
    Serial.println("  4. Router blocking connection");
    Serial.println("");
    Serial.println("Will keep retrying in loop()...");
    Serial.println("========================================");
  }

  // Setup API routes
  server.on("/data", HTTP_GET, handleData);
  server.on("/data", HTTP_OPTIONS, handleOptions);
  
  server.begin();
  Serial.println("HTTP server initialized");

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("API Endpoint: http://");
    Serial.print(WiFi.localIP());
    Serial.println("/data");
    Serial.println("========================================");
    Serial.println("✅ READY!");
    Serial.println("========================================");
  } else {
    Serial.println("⚠️  Server started but Wi-Fi not connected");
    Serial.println("API will not work until Wi-Fi connects");
  }
}

// -------- LOOP --------
void loop() {
  // Handle HTTP requests
  server.handleClient();

  // Retry Wi-Fi connection if not connected
  if (WiFi.status() != WL_CONNECTED) {
    static unsigned long lastRetry = 0;
    unsigned long now = millis();
    
    // Retry every 10 seconds
    if (now - lastRetry > 10000) {
      lastRetry = now;
      Serial.println();
      Serial.println("Retrying Wi-Fi connection...");
      WiFi.disconnect();
      delay(100);
      WiFi.begin(wifi_ssid, wifi_password);
      
      int retryAttempts = 0;
      while (WiFi.status() != WL_CONNECTED && retryAttempts < 20) {
        delay(500);
        Serial.print(".");
        retryAttempts++;
      }
      
      Serial.println();
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("✅ Reconnected to Wi-Fi!");
        Serial.print("IP: ");
        Serial.println(WiFi.localIP());
      } else {
        Serial.println("❌ Retry failed, will try again in 10 seconds");
      }
    }
  }
  
  // Small delay to prevent watchdog issues
  delay(10);
}
