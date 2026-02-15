# 🔄 Arduino R4 Setup (Replacing ESP8266)

## ✅ Code Updated for Arduino R4!

The code has been updated to work with **Arduino UNO R4 WiFi** instead of ESP8266.

---

## 🔧 Key Changes

1. **Library:** Uses `WiFiS3.h` (Arduino R4 WiFi library)
2. **ADC:** 12-bit (0-4095) instead of 10-bit (0-1023)
3. **WiFi API:** Different from ESP8266
4. **Server:** Uses `WiFiServer` instead of `ESP8266WebServer`

---

## 📤 Upload Code

### Method 1: Arduino IDE (Recommended)

1. **Open Arduino IDE**
2. **Open:** `ArduinoR4_SmartMeter/ArduinoR4_SmartMeter.ino`
3. **Select Board:** Tools → Board → Arduino UNO R4 WiFi
4. **Select Port:** Tools → Port → Your Arduino R4 port
5. **Click Upload** (→ button)

### Method 2: Terminal Script

```bash
./upload_arduino_r4.sh
```

---

## 📡 Get IP Address

1. **Open Serial Monitor** (115200 baud)
2. **Press RESET** on Arduino R4
3. **Look for:**
   ```
   ✅ CONNECTED TO WI-FI!
   IP Address: 192.168.1.XXX
   ```
4. **Copy the IP address**

---

## 🔄 Update Dashboard Config

1. **Open:** `config/esp8266.ts`
2. **Update IP:**
   ```typescript
   export const ESP8266_IP = '192.168.1.XXX'; // Your Arduino R4 IP
   ```
3. **Restart dashboard:**
   ```bash
   npm run dev
   ```

---

## ✅ Test Connection

1. **Make sure you're on same Wi-Fi** (`Airtelontopp`)
2. **Open dashboard:** `http://localhost:3000`
3. **Should see live data!**

---

## 🔍 Differences from ESP8266

| Feature | ESP8266 | Arduino R4 |
|---------|---------|------------|
| ADC Resolution | 10-bit (0-1023) | 12-bit (0-4095) |
| WiFi Library | ESP8266WiFi.h | WiFiS3.h |
| Server | ESP8266WebServer | WiFiServer |
| Port | /dev/cu.usbserial-* | /dev/cu.usbmodem-* |

---

## 📝 Quick Steps

1. ✅ Upload code to Arduino R4
2. ✅ Check Serial Monitor for IP
3. ✅ Update `config/esp8266.ts` with IP
4. ✅ Restart dashboard
5. ✅ Test!

---

**Arduino R4 code is ready!** 🚀
