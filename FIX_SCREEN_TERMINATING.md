# Fix: Screen Terminating Immediately

## 🔍 Problem
Screen connects but immediately terminates - **no data from ESP8266**.

---

## ✅ Solutions (Try in Order)

### Solution 1: Reset ESP8266 ⚠️ **MOST IMPORTANT**

**The ESP8266 needs to be reset after upload!**

1. **Press RESET button** on ESP8266
2. **Or unplug/replug** power
3. **Then immediately connect:**
   ```bash
   ./monitor_esp8266.sh
   ```

**You should see boot messages!**

---

### Solution 2: Check ESP8266 is Powered

- ✅ **LED should be ON** on ESP8266
- ✅ **USB cable connected** (if using USB power)
- ✅ **Power supply working** (if using external power)

---

### Solution 3: Verify Code is Running

**After reset, you should see:**
```
========================================
ESP8266 Smart Meter AP Started
========================================
HTTP server started
========================================
```

**If you DON'T see this:**
- Code may not have uploaded correctly
- Try uploading again: `./upload_esp8266.sh`

---

### Solution 4: Use Arduino IDE Serial Monitor

**Easier alternative:**

1. **Connect ESP8266 via USB** (not FTDI)
2. **Open Arduino IDE**
3. **Tools → Serial Monitor**
4. **Set baud rate: 115200**
5. **Press RESET on ESP8266**
6. **You'll see output!**

This is actually **easier** than terminal!

---

### Solution 5: Check Wiring (if using FTDI)

```
FTDI          ESP8266
────          ────────
GND    →      GND
TXD    →      RX (GPIO 3)
RXD    →      TX (GPIO 1)
```

**Common mistakes:**
- ❌ TXD to TX (wrong!)
- ❌ RXD to RX (wrong!)
- ❌ Missing GND

---

## 🎯 Quick Fix Steps

1. **Press RESET button** on ESP8266
2. **Run:** `./monitor_esp8266.sh`
3. **Should see boot messages**

If still not working:
- Try Arduino IDE Serial Monitor (easier!)
- Check ESP8266 is powered
- Verify wiring

---

## 💡 Why Screen Terminates

Screen exits when:
- **No data received** from ESP8266
- **ESP8266 not running** code
- **ESP8266 not powered**
- **Wrong wiring**

**Most common:** ESP8266 needs RESET after upload!

---

## ✅ Recommended: Use Arduino IDE

**For testing, Arduino IDE Serial Monitor is easier:**

1. Connect ESP8266 via USB
2. Open Serial Monitor
3. Set 115200 baud
4. Press RESET
5. ✅ See output!

**No FTDI needed for testing!**

---

**Try pressing RESET on ESP8266, then connect again!** 🔄
