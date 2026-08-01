#include <WiFi.h>

const char AP_SSID[] = "FedGrid-AP-Test";
const char AP_PASSWORD[] = "fedgrid123";

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println();
  Serial.println("FedGrid AP test boot");
  WiFi.mode(WIFI_AP);
  delay(100);

  if (WiFi.softAP(AP_SSID, AP_PASSWORD)) {
    Serial.println("AP started");
    Serial.print("SSID: ");
    Serial.println(AP_SSID);
    Serial.print("AP IP: ");
    Serial.println(WiFi.softAPIP());
  } else {
    Serial.println("AP start failed");
  }
}

void loop() {
  delay(1000);
}
