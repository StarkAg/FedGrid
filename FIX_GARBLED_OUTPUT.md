# Fix: Garbled Serial Output

## 🔍 Problem

Serial output shows garbled characters like:
```
ESP8266 Smart Metert|4`,l$x$:$ Rl4,
```

This means **baud rate or port settings are wrong**.

---

## ✅ Solution 1: Use Proper Monitor Script

```bash
./monitor_proper.sh
```

This script properly configures the port before reading.

---

## ✅ Solution 2: Use Arduino IDE Serial Monitor (BEST!)

**Arduino IDE handles all settings automatically!**

1. **Open Arduino IDE**
2. **Connect ESP8266 via USB**
3. **Tools → Serial Monitor**
4. **Set baud: 115200** (bottom right)
5. **Press RESET on ESP8266**
6. **See clean output!**

**No garbled text, no configuration needed!**

---

## ✅ Solution 3: Manual Port Configuration

```bash
# Configure port
stty -f /dev/cu.usbserial-10 115200 cs8 -cstopb -parenb raw -echo

# Then read
cat /dev/cu.usbserial-10
```

---

## 🔍 Why Output is Garbled

- **Wrong baud rate** (most common)
- **Port not configured** before reading
- **ESP8266 sending at different speed**

**ESP8266 code uses 115200 baud - must match!**

---

## 🎯 Recommended: Arduino IDE

**Arduino IDE Serial Monitor:**
- ✅ Auto-configures port
- ✅ Shows clean text
- ✅ Easy to use
- ✅ No terminal issues

---

## 📝 Quick Test

1. **Open Arduino IDE**
2. **Serial Monitor → 115200**
3. **Press RESET on ESP8266**
4. **See clean output!**

---

**Use Arduino IDE Serial Monitor for best results!** 📡
