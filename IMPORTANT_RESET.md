# ⚠️ IMPORTANT: Reset ESP8266 After Upload!

## 🔄 Critical Step

**After uploading code, you MUST reset the ESP8266!**

---

## ✅ How to Reset

### Method 1: Reset Button
1. **Find RESET button** on ESP8266 (usually small button)
2. **Press it once**
3. **ESP8266 will reboot**
4. **You'll see boot messages**

### Method 2: Power Cycle
1. **Unplug USB/power**
2. **Wait 2 seconds**
3. **Plug back in**
4. **ESP8266 will boot**

---

## 📡 After Reset, Connect

```bash
./clean_connect.sh
```

**OR:**
```bash
screen /dev/cu.usbserial-10 115200
```

**You should immediately see:**
```
========================================
ESP8266 Smart Meter AP Started
========================================
AP SSID: SmartMeter_Node1
AP IP Address: 192.168.4.1
========================================
HTTP server started
========================================
```

---

## ❌ If Screen Still Terminates

**This means ESP8266 is not sending data. Check:**

1. ✅ **ESP8266 is powered** (LED on)
2. ✅ **Code was uploaded** (check upload script output)
3. ✅ **RESET button pressed** after upload
4. ✅ **Wiring correct** (if using FTDI)

---

## 💡 Easier Alternative

**Use Arduino IDE Serial Monitor:**

1. Connect ESP8266 via USB
2. Open Arduino IDE
3. Tools → Serial Monitor
4. Set 115200 baud
5. Press RESET on ESP8266
6. ✅ See output!

**No terminal needed!**

---

## 🎯 Quick Test

1. **Press RESET** on ESP8266
2. **Run:** `./clean_connect.sh`
3. **Should see boot messages**

If you see boot messages → ✅ ESP8266 is working!
If screen terminates → ❌ ESP8266 not running code

---

**Press RESET button, then connect!** 🔄
