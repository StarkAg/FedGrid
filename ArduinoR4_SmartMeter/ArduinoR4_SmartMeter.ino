#include <WiFiS3.h>  // For Arduino R4 WiFi
#include <WiFiServer.h>

// -------- WIFI CONFIG (Station Mode - Connect to Router) --------
const char* wifi_ssid = "Airtelontopp";
const char* wifi_password = "estancia3071";

// -------- SERVER --------
WiFiServer server(80);

// -------- POT CONFIG --------
#define POT_PIN A1  // Changed from A0 to A1
const float MAX_CURRENT = 5.0;   // Simulated max current (A)
const float PEAK_THRESHOLD = 3.0;

// -------- VARIABLES --------
float currentValue = 0.0;
int rawADC = 0;
String loadStatus = "NORMAL";
unsigned long lastUpdate = 0;

// -------- FUNCTION DECLARATIONS --------
void setCORSHeaders(WiFiClient& client);
void handleData(WiFiClient& client);
void readPotentiometer();

// -------- READ POT --------
void readPotentiometer() {
  rawADC = analogRead(POT_PIN);   // 0–4095 for R4 (12-bit ADC)
  
  // Debug: Print raw ADC value to Serial
  Serial.print("ADC Raw: ");
  Serial.print(rawADC);
  Serial.print(" | ");
  
  currentValue = (rawADC / 4095.0) * MAX_CURRENT;
  
  Serial.print("Current: ");
  Serial.println(currentValue, 2);

  if (currentValue > PEAK_THRESHOLD) {
    loadStatus = "PEAK";
  } else {
    loadStatus = "NORMAL";
  }

  lastUpdate = millis();
}

// -------- CORS HEADERS --------
void setCORSHeaders(WiFiClient& client) {
  client.println("Access-Control-Allow-Origin: *");
  client.println("Access-Control-Allow-Methods: GET, OPTIONS");
  client.println("Access-Control-Allow-Headers: Content-Type");
}

// -------- API HANDLER --------
void handleData(WiFiClient& client) {
  readPotentiometer();

  // Build JSON response matching dashboard expectations
  String json = "{";
  json += "\"current\": " + String(currentValue, 2) + ",";
  json += "\"raw_adc\": " + String(rawADC) + ",";
  json += "\"status\": \"" + loadStatus + "\",";
  json += "\"timestamp\": " + String(lastUpdate);
  json += "}";

  // Also print to Serial for serial proxy to read
  Serial.println("DATA:" + json);

  // Send response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  setCORSHeaders(client);
  client.println("Connection: close");
  client.println();
  client.println(json);
}

// -------- SETUP --------
void setup() {
  Serial.begin(115200);
  delay(1000); // Give serial time to initialize

  Serial.println();
  Serial.println("========================================");
  Serial.println("Arduino R4 Smart Meter - Starting...");
  Serial.println("========================================");

  // Check WiFi module
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("❌ WiFi module not found!");
    while (true); // Don't continue
  }

  // Connect to Wi-Fi
  Serial.print("SSID: ");
  Serial.println(wifi_ssid);
  Serial.print("Password: ");
  Serial.println("********");
  Serial.println("Connecting to Wi-Fi...");

  int status = WiFi.begin(wifi_ssid, wifi_password);

  // Wait for connection with longer timeout
  int attempts = 0;
  int maxAttempts = 60; // 30 seconds total

  while (status != WL_CONNECTED && attempts < maxAttempts) {
    delay(500);
    Serial.print(".");
    attempts++;
    status = WiFi.status();
    
    // Print status every 10 attempts
    if (attempts % 10 == 0) {
      Serial.println();
      Serial.print("Status: ");
      Serial.println(status);
      Serial.print("Attempts: ");
      Serial.print(attempts);
      Serial.print("/");
      Serial.println(maxAttempts);
    }
  }

  Serial.println();
  Serial.println();

  // Wait for IP address assignment (DHCP)
  if (status == WL_CONNECTED) {
    Serial.println("Waiting for IP address assignment...");
    int ipAttempts = 0;
    while (WiFi.localIP()[0] == 0 && ipAttempts < 30) {
      delay(500);
      Serial.print(".");
      ipAttempts++;
    }
    Serial.println();
    Serial.println();
  }

  // Check connection result
  if (status == WL_CONNECTED) {
    IPAddress ip = WiFi.localIP();
    Serial.println("========================================");
    Serial.println("✅ CONNECTED TO WI-FI!");
    Serial.println("========================================");
    Serial.print("IP Address: ");
    if (ip[0] == 0) {
      Serial.println("Not assigned yet (check router)");
      Serial.println("Try:");
      Serial.println("  1. Check router DHCP settings");
      Serial.println("  2. Wait a few seconds and check again");
      Serial.println("  3. Restart Arduino R4");
    } else {
      Serial.println(ip);
    }
    Serial.print("Signal Strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    Serial.print("MAC Address: ");
    uint8_t mac[6];
    WiFi.macAddress(mac);
    for (int i = 0; i < 6; i++) {
      if (i > 0) Serial.print(":");
      if (mac[i] < 16) Serial.print("0");
      Serial.print(mac[i], HEX);
    }
    Serial.println();
    Serial.println("========================================");
  } else {
    Serial.println("========================================");
    Serial.println("❌ FAILED TO CONNECT TO WI-FI!");
    Serial.println("========================================");
    Serial.print("Wi-Fi Status Code: ");
    Serial.println(status);
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

  // Start server
  server.begin();
  Serial.println("HTTP server initialized");

  if (status == WL_CONNECTED) {
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

  // Handle HTTP requests
  WiFiClient client = server.available();
  
  if (client) {
    Serial.println("New client connected");
    String request = "";
    unsigned long timeout = millis();
    
    // Read the request with timeout
    while (client.connected() && (millis() - timeout < 5000)) {
      if (client.available()) {
        char c = client.read();
        request += c;
        timeout = millis(); // Reset timeout
        
        // End of request headers (blank line)
        if (request.endsWith("\r\n\r\n")) {
          break;
        }
      }
    }
    
    Serial.print("Request received: ");
    Serial.println(request.substring(0, min(100, (int)request.length())));
    
    // Parse request
    if (request.indexOf("GET /data") >= 0 || request.indexOf("get /data") >= 0) {
      Serial.println("Handling /data request");
      handleData(client);
    } else if (request.indexOf("OPTIONS") >= 0) {
      Serial.println("Handling OPTIONS request");
      client.println("HTTP/1.1 204 No Content");
      setCORSHeaders(client);
      client.println();
    } else if (request.length() > 0) {
      Serial.println("Unknown request, sending 404");
      // 404 for other requests
      client.println("HTTP/1.1 404 Not Found");
      client.println("Content-Type: text/plain");
      setCORSHeaders(client);
      client.println("Connection: close");
      client.println();
      client.println("404 - Not Found. Use /data endpoint");
    }
    
    delay(10); // Give client time to receive
    client.stop();
    Serial.println("Client disconnected");
  }
  
  // Read and print potentiometer data to Serial periodically
  static unsigned long lastSerialPrint = 0;
  unsigned long now = millis();
  
  // Print data to Serial every 500ms for serial proxy to read
  if (now - lastSerialPrint > 500) {
    lastSerialPrint = now;
    
    // Read potentiometer directly
    rawADC = analogRead(POT_PIN);
    currentValue = (rawADC / 4095.0) * MAX_CURRENT;
    
    if (currentValue > PEAK_THRESHOLD) {
      loadStatus = "PEAK";
    } else {
      loadStatus = "NORMAL";
    }
    
    lastUpdate = millis();
    
    // Print JSON to Serial for serial proxy
    String json = "{";
    json += "\"current\":" + String(currentValue, 2) + ",";
    json += "\"raw_adc\":" + String(rawADC) + ",";
    json += "\"status\":\"" + loadStatus + "\",";
    json += "\"timestamp\":" + String(lastUpdate);
    json += "}";
    
    Serial.println("DATA:" + json);
    
    // Debug output
    Serial.print("DEBUG: ADC=");
    Serial.print(rawADC);
    Serial.print(" Current=");
    Serial.println(currentValue, 2);
  }
  
  // Small delay to prevent watchdog issues
  delay(10);
}
