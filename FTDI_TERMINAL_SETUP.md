# FTDI FT232R USB UART Terminal Setup Guide

Complete guide for connecting ESP8266 via FTDI FT232R and using terminal for serial communication.

## 🔌 Hardware Connection

### FTDI FT232R to ESP8266 Wiring:

```
FTDI FT232R          ESP8266 (NodeMCU/ESP-12E)
─────────────────    ─────────────────────────
VCC (5V)      →      VCC (or 3.3V if available)
GND           →      GND
TXD           →      RX (GPIO 3)
RXD           →      TX (GPIO 1)
```

**⚠️ IMPORTANT:**
- **DO NOT** connect VCC if ESP8266 is powered via USB
- **ONLY** connect GND, TXD, and RXD for serial communication
- ESP8266 should be powered separately (via USB or external power)

### Safe Connection (Recommended):
```
FTDI FT232R          ESP8266
─────────────────    ────────
GND           →      GND
TXD           →      RX (GPIO 3)
RXD           →      TX (GPIO 1)
(VCC left unconnected - ESP8266 powered via USB)
```

---

## 💻 Mac Terminal Setup

### Step 1: Connect FTDI FT232R to Mac

1. Plug FTDI FT232R into USB port
2. Mac will detect it automatically
3. Check if driver is installed (usually auto-installed on macOS)

### Step 2: Find the Serial Port

Open Terminal and run:

```bash
# List all serial ports
ls /dev/tty.*

# Or specifically look for FTDI devices
ls /dev/tty.usbserial*

# Common FTDI port names:
# /dev/tty.usbserial-XXXXXXXX
# /dev/tty.usbserial-AXXXXXXX
```

**Note the port name** (e.g., `/dev/tty.usbserial-A50285BI`)

### Step 3: Check Port Permissions

```bash
# Check if you have permission
ls -l /dev/tty.usbserial*

# If permission denied, add your user to dialout group
# (Usually not needed on Mac, but just in case)
```

### Step 4: Install Serial Communication Tools

**Option A: Using `screen` (Built-in on Mac)**

```bash
# Connect to ESP8266 at 115200 baud
screen /dev/tty.usbserial-XXXXXXXX 115200

# To exit: Press Ctrl+A, then K, then Y
```

**Option B: Using `minicom` (Install via Homebrew)**

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install minicom
brew install minicom

# Connect to ESP8266
minicom -D /dev/tty.usbserial-XXXXXXXX -b 115200
```

**Option C: Using `cu` (Built-in on Mac)**

```bash
# Connect to ESP8266
cu -l /dev/tty.usbserial-XXXXXXXX -s 115200

# To exit: Type ~. and press Enter
```

---

## 🚀 Quick Start Commands

### Connect and Monitor:

```bash
# Replace XXXX with your actual port name
screen /dev/tty.usbserial-XXXX 115200
```

### What You Should See:

After uploading the code and connecting, you should see:

```
========================================
ESP8266 Smart Meter AP Started
========================================
AP SSID: SmartMeter_Node1
AP IP Address: 192.168.4.1
========================================
HTTP server started
Endpoint: http://192.168.4.1/data
========================================
Ready! Connect to Wi-Fi: SmartMeter_Node1
========================================
```

---

## 📝 Useful Terminal Commands

### Monitor Serial Output:

```bash
# Basic connection
screen /dev/tty.usbserial-XXXX 115200

# With line endings
screen /dev/tty.usbserial-XXXX 115200 -L
```

### Send Commands to ESP8266:

While connected via `screen`:
- Type commands and press Enter
- ESP8266 will process them (if code supports it)

### View Serial Logs in Real-time:

```bash
# Using cat (read-only)
cat /dev/tty.usbserial-XXXX

# Using tail (if log file exists)
tail -f /path/to/logfile
```

### Check if Port is Available:

```bash
# Check port status
ls -l /dev/tty.usbserial-XXXX

# Check if port is in use
lsof /dev/tty.usbserial-XXXX
```

---

## 🔧 Troubleshooting

### Problem: Port Not Found

**Solutions:**
```bash
# Check if FTDI is connected
system_profiler SPUSBDataType | grep -i ftdi

# List all USB devices
ioreg -p IOUSB -l -w 0

# Check kernel messages
dmesg | grep -i tty
```

### Problem: Permission Denied

**Solutions:**
```bash
# Add your user to dialout (if exists)
sudo dseditgroup -o edit -a $(whoami) -t user dialout

# Or use sudo (not recommended for regular use)
sudo screen /dev/tty.usbserial-XXXX 115200
```

### Problem: Can't Connect

**Solutions:**
- Unplug and replug FTDI adapter
- Check USB cable
- Try different USB port
- Restart ESP8266
- Check wiring (GND, TX, RX)

### Problem: Garbage Characters

**Solutions:**
- Verify baud rate is 115200
- Check wiring connections
- Ensure ESP8266 is powered
- Try different baud rates: 9600, 57600, 115200

### Problem: Port Disappears

**Solutions:**
```bash
# Check USB connection
system_profiler SPUSBDataType

# Reset USB ports (unplug/replug)
# Or restart Mac
```

---

## 📊 Advanced Usage

### Create a Monitoring Script:

Create `monitor_esp8266.sh`:

```bash
#!/bin/bash

PORT="/dev/tty.usbserial-XXXX"
BAUD=115200

echo "Connecting to ESP8266 on $PORT at $BAUD baud..."
echo "Press Ctrl+A then K to exit"
echo ""

screen $PORT $BAUD
```

Make it executable:
```bash
chmod +x monitor_esp8266.sh
./monitor_esp8266.sh
```

### Log Serial Output to File:

```bash
# Using screen with logging
screen -L -Logfile esp8266.log /dev/tty.usbserial-XXXX 115200

# Or using cat
cat /dev/tty.usbserial-XXXX > esp8266.log
```

### Monitor Multiple Ports:

```bash
# Open multiple terminal windows
# Terminal 1:
screen /dev/tty.usbserial-XXXX 115200

# Terminal 2:
screen /dev/tty.usbserial-YYYY 115200
```

---

## 🎯 Workflow for Development

### 1. Upload Code via Arduino IDE
- Use Arduino IDE to upload code
- Arduino IDE will use its own serial port

### 2. Disconnect from Arduino IDE
- Close Serial Monitor in Arduino IDE
- Unplug ESP8266 from Arduino IDE's USB port

### 3. Connect via FTDI
- Connect FTDI to ESP8266 (GND, TX, RX)
- Connect FTDI to Mac USB port

### 4. Monitor in Terminal
```bash
screen /dev/tty.usbserial-XXXX 115200
```

### 5. Test API
- In another terminal or browser
- Test: `http://192.168.4.1/data`
- Watch serial output in screen session

---

## 🔍 Debugging Tips

### Check Serial Communication:

```bash
# Send test data (if ESP8266 code supports it)
# Type in screen session and press Enter

# Check if ESP8266 is responding
# Look for serial output when API is called
```

### Monitor Network Activity:

```bash
# In another terminal, monitor network
# While screen is running, test API:
curl http://192.168.4.1/data

# Watch screen for serial output
```

### Reset ESP8266:

```bash
# If ESP8266 is unresponsive:
# 1. Press RESET button on ESP8266
# 2. Or unplug/replug power
# 3. Watch screen for boot messages
```

---

## ✅ Quick Reference

### Connection:
```bash
screen /dev/tty.usbserial-XXXX 115200
```

### Exit Screen:
```
Ctrl+A, then K, then Y
```

### Find Port:
```bash
ls /dev/tty.usbserial*
```

### Check Connection:
```bash
system_profiler SPUSBDataType | grep -i ftdi
```

### Common Port Names:
- `/dev/tty.usbserial-XXXXXXXX`
- `/dev/tty.usbserial-AXXXXXXX`
- `/dev/tty.usbmodemXXXX` (some adapters)

---

## 🚀 Ready to Use!

Once connected via terminal, you can:
- ✅ Monitor serial output in real-time
- ✅ See boot messages
- ✅ Debug API calls
- ✅ Watch sensor readings
- ✅ Test without Arduino IDE

Happy debugging! 🎉
