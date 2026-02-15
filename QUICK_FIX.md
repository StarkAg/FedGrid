# Quick Fix: Screen Terminating Immediately

## 🔍 Problem
Screen connects but immediately terminates - this means **no data is coming from ESP8266**.

---

## ✅ Most Likely Causes & Solutions

### 1. ESP8266 Code Not Uploaded ⚠️ **MOST COMMON**

**Solution:**
1. **Open Arduino IDE**
2. **Open `ESP8266_SmartMeter.ino`**
3. **Select Tools → Board → NodeMCU 1.0 (ESP-12E Module)**
4. **Select Tools → Port → Your ESP8266 USB port**
5. **Click Upload** (→ button)
6. **Wait for "Done uploading"**
7. **Then try screen connection again**

---

### 2. ESP8266 Not Powered On

**Check:**
- ✅ Is ESP8266 LED on?
- ✅ Is USB cable connected?
- ✅ Is power supply working?

**Solution:**
- Power on ESP8266 first
- Then connect via FTDI

---

### 3. Wrong Wiring

**Verify:**
```
FTDI          ESP8266
────          ────────
GND    →      GND
TXD    →      RX (GPIO 3)
RXD    →      TX (GPIO 1)
```

**Common Mistakes:**
- ❌ TXD to TX (wrong - should be TXD to RX)
- ❌ RXD to RX (wrong - should be RXD to TX)
- ❌ Missing GND connection

---

### 4. ESP8266 Not Running Code

**Test:**
1. **Connect ESP8266 via USB to Mac**
2. **Open Arduino IDE Serial Monitor**
3. **Set baud rate to 115200**
4. **Do you see output?**

If **NO output** in Arduino IDE:
- Code is not uploaded
- Upload code first!

If **YES output** in Arduino IDE:
- Code is working
- Then try FTDI connection

---

## 🎯 Recommended Workflow

### Step 1: Upload Code via Arduino IDE
```
1. Connect ESP8266 via USB
2. Open ESP8266_SmartMeter.ino
3. Upload code
4. Open Serial Monitor (115200)
5. Verify you see "HTTP server started"
```

### Step 2: Test in Arduino IDE First
- ✅ If Serial Monitor shows output → Code is working!
- ✅ Then you can test API: `http://192.168.4.1/data`
- ✅ Connect to Wi-Fi: `SmartMeter_Node1`

### Step 3: Then Try FTDI (Optional)
- Only if you need terminal access
- Arduino IDE Serial Monitor works fine for testing!

---

## 💡 EASIEST SOLUTION

**Just use Arduino IDE Serial Monitor!**

1. **Connect ESP8266 via USB** (not FTDI)
2. **Open Arduino IDE**
3. **Upload code**
4. **Open Serial Monitor**
5. **Done!** ✅

You don't actually need FTDI for testing - Arduino IDE works perfectly!

---

## 🔧 If You Must Use Terminal

### Try this sequence:

```bash
# 1. Make sure ESP8266 is powered and code is uploaded
# 2. Kill any stuck processes
pkill -f screen

# 3. Wait a moment
sleep 2

# 4. Try connecting
screen /dev/tty.usbserial-A5069RR4 115200

# 5. If still terminating, ESP8266 is not sending data
#    → Upload code via Arduino IDE first!
```

---

## ✅ Quick Test

**Before using FTDI, test with Arduino IDE:**

1. Connect ESP8266 via USB
2. Arduino IDE → Serial Monitor
3. Set 115200 baud
4. **Do you see output?**

**If YES:** Code is working, you can use FTDI
**If NO:** Upload code first!

---

**Bottom line: Upload code via Arduino IDE first, then test!** 🚀
