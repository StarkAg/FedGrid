# Quick Terminal Connection Guide

## 🚀 Fastest Way to Connect

### Option 1: Use the Script (Easiest)

```bash
cd "/Users/mrstark/Desktop/Code Play Ground/FedGrid"
./connect_esp8266.sh
```

### Option 2: Manual Connection

```bash
# Find your port
ls /dev/tty.usbserial*

# Connect (replace XXXX with your port)
screen /dev/tty.usbserial-XXXX 115200
```

---

## 📡 Your Detected Port

Based on your system, I found:
```
/dev/tty.usbserial-A5069RR4
```

### Connect Now:

```bash
screen /dev/tty.usbserial-A5069RR4 115200
```

---

## 🔌 Hardware Connection

### FTDI FT232R → ESP8266:

```
FTDI          ESP8266
────          ────────
GND    →      GND
TXD    →      RX (GPIO 3)
RXD    →      TX (GPIO 1)
```

**⚠️ Important:**
- **DO NOT** connect VCC (ESP8266 should be powered separately)
- Only connect GND, TXD, RXD
- ESP8266 can be powered via USB or external power

---

## ✅ What You Should See

After connecting, you should see:

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

## 🎮 Controls

### Exit Screen:
```
Press: Ctrl+A
Then:  K
Then:  Y (to confirm)
```

### Clear Screen:
```
Press: Ctrl+A
Then:  C
```

### Scroll Back:
```
Press: Ctrl+A
Then:  [ (enter scroll mode)
Use arrow keys to scroll
Press ESC to exit scroll mode
```

---

## 🧪 Testing

### While Connected:

1. **Test API in another terminal:**
   ```bash
   curl http://192.168.4.1/data
   ```

2. **Watch serial output** - You'll see the request in screen

3. **Rotate potentiometer** - Watch values change

---

## 🔧 Troubleshooting

### Port Not Found:
```bash
# Check if FTDI is connected
ls /dev/tty.usbserial*

# If empty, unplug and replug FTDI adapter
```

### Permission Denied:
```bash
# Use sudo (not ideal, but works)
sudo screen /dev/tty.usbserial-A5069RR4 115200
```

### Garbage Characters:
- Check baud rate is 115200
- Verify wiring connections
- Ensure ESP8266 is powered

### Can't Exit:
- Press Ctrl+A, then K, then Y
- If stuck, close terminal window
- Or: `killall screen`

---

## 📝 Quick Commands Reference

```bash
# Connect
screen /dev/tty.usbserial-A5069RR4 115200

# Exit
Ctrl+A, K, Y

# Find port
ls /dev/tty.usbserial*

# Check if connected
lsof /dev/tty.usbserial-A5069RR4
```

---

## 🎯 Workflow

1. **Upload code** via Arduino IDE (if needed)
2. **Disconnect** from Arduino IDE Serial Monitor
3. **Connect FTDI** to ESP8266 (GND, TX, RX)
4. **Run connection script:**
   ```bash
   ./connect_esp8266.sh
   ```
5. **Monitor** serial output in real-time
6. **Test API** in another terminal

---

Ready to connect! 🚀
