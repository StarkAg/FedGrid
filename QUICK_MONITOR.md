# 📡 Quick ESP8266 Monitor - No PTY Errors!

## ✅ Method 1: Use `cu` (Built-in Mac, No PTY Issues)

```bash
./monitor_fixed.sh
```

**To exit:** Type `~.` and press Enter

---

## ✅ Method 2: Use `cat` (Simplest)

```bash
cat /dev/cu.usbserial-10
```

**Press Ctrl+C to exit**

---

## ✅ Method 3: Install Python Serial (Best for Debugging)

```bash
# Install pyserial
pip3 install pyserial

# Run monitor
python3 python_monitor.py
```

---

## ✅ Method 4: Arduino IDE Serial Monitor (Easiest!)

1. **Open Arduino IDE**
2. **Tools → Serial Monitor**
3. **Set baud: 115200**
4. **Press RESET on ESP8266**
5. **See output!**

**No terminal errors!**

---

## 🎯 Recommended Workflow

1. **Use Arduino IDE Serial Monitor** to see connection status
2. **Get IP address** from Serial Monitor
3. **Update** `config/esp8266.ts` with IP
4. **Test dashboard**

---

## 📝 Quick Test

```bash
# Try fixed monitor
./monitor_fixed.sh

# Or simple cat
cat /dev/cu.usbserial-10
```

---

**Try `./monitor_fixed.sh` or use Arduino IDE!** 📡
