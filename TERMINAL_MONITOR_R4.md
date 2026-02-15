# 📡 Terminal Serial Monitor for Arduino R4

## ✅ Quick Start

```bash
./monitor_r4.sh
```

**Press Ctrl+C to exit**

---

## 📋 What It Does

1. ✅ Finds Arduino R4 port (`/dev/cu.usbmodem*`)
2. ✅ Kills stuck processes
3. ✅ Configures port (115200 baud)
4. ✅ Shows serial output

---

## 🔍 Manual Method

If script doesn't work:

```bash
# 1. Find port
ls /dev/cu.usbmodem*

# 2. Configure port
stty -f /dev/cu.usbmodem4827E2E04AC42 115200 cs8 -cstopb -parenb raw -echo

# 3. Read output
cat /dev/cu.usbmodem4827E2E04AC42
```

**Press Ctrl+C to exit**

---

## 🎯 What You'll See

After pressing RESET on Arduino R4:

```
========================================
Arduino R4 Smart Meter - Starting...
========================================
SSID: Airtelontopp
Connecting to Wi-Fi...
..................
Waiting for IP address assignment...
..................
========================================
✅ CONNECTED TO WI-FI!
========================================
IP Address: 192.168.1.XXX
========================================
```

---

## 🔧 Troubleshooting

### Port not found?
```bash
# List all USB devices
ls /dev/cu.usb*

# Or check Arduino IDE for port name
```

### Garbled output?
```bash
# Make sure baud is 115200
stty -f /dev/cu.usbmodem* 115200
```

### Port busy?
```bash
# Kill processes
lsof /dev/cu.usbmodem* | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

---

## 📝 Quick Commands

```bash
# Monitor
./monitor_r4.sh

# Or simple cat
cat /dev/cu.usbmodem4827E2E04AC42

# Exit: Ctrl+C
```

---

**Run `./monitor_r4.sh` to see Arduino R4 output!** 📡
