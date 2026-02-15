# Troubleshooting ESP8266 Connection

## Issue: Screen Terminates Immediately

If `screen` connects and immediately disconnects, try these solutions:

---

## ✅ Solution 1: Check Hardware Connections

### Verify Wiring:
```
FTDI FT232R          ESP8266
─────────────────    ────────
GND           →      GND
TXD           →      RX (GPIO 3)
RXD           →      TX (GPIO 1)
```

**Important:**
- ✅ ESP8266 must be **powered on** (via USB or external power)
- ✅ **DO NOT** connect FTDI VCC to ESP8266 (power separately)
- ✅ Double-check GND connection (common ground is critical)

---

## ✅ Solution 2: Check Port Permissions

```bash
# Check port permissions
ls -l /dev/tty.usbserial-A5069RR4

# Fix permissions if needed
sudo chmod 666 /dev/tty.usbserial-A5069RR4
```

---

## ✅ Solution 3: Verify ESP8266 is Running

### Check if ESP8266 has code uploaded:

1. **Upload code via Arduino IDE first:**
   - Open `ESP8266_SmartMeter.ino` in Arduino IDE
   - Select correct board and port
   - Click Upload
   - Wait for "Done uploading"

2. **Then connect via FTDI:**
   - Disconnect from Arduino IDE's USB port
   - Connect FTDI adapter
   - Run connection script

---

## ✅ Solution 4: Try Different Connection Method

### Method A: Using `cu` (Built-in Mac tool)

```bash
cu -l /dev/tty.usbserial-A5069RR4 -s 115200
```

To exit: Type `~.` and press Enter

### Method B: Using `minicom` (Install via Homebrew)

```bash
# Install minicom
brew install minicom

# Connect
minicom -D /dev/tty.usbserial-A5069RR4 -b 115200
```

To exit: Press Ctrl+A, then X

### Method C: Using `cat` (Simple read-only)

```bash
# Just read data (won't send)
cat /dev/tty.usbserial-A5069RR4
```

Press Ctrl+C to stop

---

## ✅ Solution 5: Test Connection Step by Step

### Step 1: Test Port Exists
```bash
ls /dev/tty.usbserial-A5069RR4
```

### Step 2: Test Port is Readable
```bash
cat /dev/tty.usbserial-A5069RR4
# (Press Ctrl+C after a few seconds)
```

### Step 3: Configure Port Settings
```bash
stty -f /dev/tty.usbserial-A5069RR4 115200 cs8 -cstopb -parenb
```

### Step 4: Connect with Screen
```bash
screen /dev/tty.usbserial-A5069RR4 115200
```

---

## ✅ Solution 6: Reset ESP8266

1. **Press RESET button** on ESP8266
2. **Or unplug/replug power**
3. **Then immediately connect:**
   ```bash
   screen /dev/tty.usbserial-A5069RR4 115200
   ```
4. You should see boot messages

---

## ✅ Solution 7: Check Baud Rate

Try different baud rates:

```bash
# Try 9600
screen /dev/tty.usbserial-A5069RR4 9600

# Try 57600
screen /dev/tty.usbserial-A5069RR4 57600

# Try 115200 (default)
screen /dev/tty.usbserial-A5069RR4 115200
```

---

## 🔍 Diagnostic Commands

### Check if port is in use:
```bash
lsof /dev/tty.usbserial-A5069RR4
```

### Check USB devices:
```bash
system_profiler SPUSBDataType | grep -i ftdi
```

### Test port with timeout:
```bash
timeout 5 cat /dev/tty.usbserial-A5069RR4
```

---

## 🎯 Quick Fix Checklist

- [ ] ESP8266 is powered on (LED should be on)
- [ ] FTDI is connected to Mac USB port
- [ ] Wiring: GND, TX, RX connected correctly
- [ ] ESP8266 code is uploaded (via Arduino IDE)
- [ ] Port exists: `ls /dev/tty.usbserial-A5069RR4`
- [ ] Try: `sudo chmod 666 /dev/tty.usbserial-A5069RR4`
- [ ] Try: `screen /dev/tty.usbserial-A5069RR4 115200`
- [ ] Press RESET on ESP8266 before connecting

---

## 💡 Alternative: Use Arduino IDE Serial Monitor

If FTDI connection doesn't work:

1. **Connect ESP8266 directly to Mac via USB**
2. **Open Arduino IDE**
3. **Tools → Serial Monitor**
4. **Set baud rate to 115200**
5. **You'll see the same output!**

This is actually easier for initial testing!

---

## 🚀 Recommended Workflow

1. **Upload code** via Arduino IDE (USB connection)
2. **Test in Arduino IDE Serial Monitor** (verify it works)
3. **Then switch to FTDI** for terminal access (if needed)

---

Try the solutions above and let me know what you see! 🔧
