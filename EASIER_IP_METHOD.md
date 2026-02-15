# 🔍 Get ESP8266 IP Address - Easy Methods

## ⚠️ Screen Terminating Issue

If `screen` terminates immediately, try these methods:

---

## Method 1: Arduino IDE Serial Monitor (EASIEST) ⭐

1. **Open Arduino IDE**
2. **Connect ESP8266 via USB**
3. **Tools → Serial Monitor**
4. **Set baud rate: 115200**
5. **Press RESET button on ESP8266**
6. **You'll see:**
   ```
   ✅ Connected to Wi-Fi!
   IP Address: 192.168.1.XXX
   ```
7. **Copy the IP address**

**This is the easiest method!**

---

## Method 2: Check Router Admin Page

1. **Open router admin page** (usually `192.168.1.1` or `192.168.0.1`)
2. **Look for "Connected Devices" or "DHCP Clients"**
3. **Find device named "ESP8266" or check MAC addresses**
4. **Note the IP address**

---

## Method 3: Network Scan

```bash
./find_esp8266_ip.sh
```

This will try to find the ESP8266 on your network.

---

## Method 4: Try Common IPs

ESP8266 usually gets IPs like:
- `192.168.1.100` - `192.168.1.110`
- `192.168.0.100` - `192.168.0.110`

**Test in browser:**
```
http://192.168.1.100/data
http://192.168.1.101/data
http://192.168.1.102/data
...
```

If you see JSON response → That's your ESP8266 IP!

---

## Method 5: Fix Screen Connection

If screen keeps terminating:

1. **Press RESET on ESP8266** (very important!)
2. **Wait 2 seconds**
3. **Then run:**
   ```bash
   ./clean_connect.sh
   ```

**Screen terminates when ESP8266 isn't sending data!**

---

## ✅ After Getting IP

1. **Open:** `config/esp8266.ts`
2. **Update:**
   ```typescript
   export const ESP8266_IP = '192.168.1.XXX'; // Your IP
   ```
3. **Restart dashboard:**
   ```bash
   npm run dev
   ```

---

## 🎯 Recommended: Use Arduino IDE Serial Monitor

**It's the easiest and most reliable method!**

1. Open Serial Monitor
2. Press RESET
3. See IP address
4. Done!

---

**Try Arduino IDE Serial Monitor first!** 📡
