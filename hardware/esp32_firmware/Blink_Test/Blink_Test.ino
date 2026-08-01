#include <Arduino.h>

constexpr int LED_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
  delay(300);
  Serial.println();
  Serial.println("Blink test boot");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(500);
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(500);
}
