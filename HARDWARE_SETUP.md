# Hardware Setup Guide - Fedgrid ESP8266 Smart Meter

Complete step-by-step guide for setting up the ESP8266 hardware and connecting it to the dashboard.

## 📋 Table of Contents

1. [Required Components](#required-components)
2. [Hardware Connections](#hardware-connections)
3. [Arduino IDE Setup](#arduino-ide-setup)
4. [Uploading Code](#uploading-code)
5. [Testing the Hardware](#testing-the-hardware)
6. [Connecting to Dashboard](#connecting-to-dashboard)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Required Components

### Essential Components:
- **ESP8266 Module** (NodeMCU v1.0 or ESP-12E)
- **10kΩ Potentiometer** (Linear/Bourns type)
- **Breadboard** (optional, for prototyping)
- **Jumper Wires** (Male-to-Male)
- **USB Cable** (Micro-USB for NodeMCU)
- **Computer** (Windows/Mac/Linux)

### Optional but Recommended:
- **Resistors** (220Ω for LED indicators)
- **LED** (for status indication)
- **Power Supply** (5V, 1A minimum)

---

## 🔌 Hardware Connections

### Connection Diagram

```
ESP8266 (NodeMCU)          Potentiometer
─────────────────          ──────────────
3.3V (VCC)        ────────→ VCC (Left Pin)
GND               ────────→ GND (Right Pin)
A0 (ADC)          ────────→ Wiper (Middle Pin)
```

### Step-by-Step Wiring:

1. **Power Connections:**
   - Connect ESP8266 **3.3V** pin to potentiometer **VCC** (left pin)
   - Connect ESP8266 **GND** pin to potentiometer **GND** (right pin)
   - ⚠️ **IMPORTANT**: Use 3.3V, NOT 5V (ESP8266 ADC is 3.3V tolerant)

2. **Signal Connection:**
   - Connect ESP8266 **A0** (Analog Input) to potentiometer **Wiper** (middle pin)

3. **Visual Reference:**
   ```
   Potentiometer (Top View):
   
        VCC ────┐
                │
        Wiper ──┼─── (to A0)
                │
        GND ────┘
   ```

### Pin Mapping (NodeMCU v1.0):
- **3.3V**: Power output pin
- **GND**: Ground pin
- **A0**: Analog input (ADC) - reads 0-1023 (0-1V range)

---

## 💻 Arduino IDE Setup

### Step 1: Install Arduino IDE
1. Download from: https://www.arduino.cc/en/software
2. Install the application

### Step 2: Add ESP8266 Board Support

1. Open Arduino IDE
2. Go to **File → Preferences**
3. In **Additional Board Manager URLs**, add:
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
4. Click **OK**

### Step 3: Install ESP8266 Board Package

1. Go to **Tools → Board → Boards Manager**
2. Search for **"ESP8266"**
3. Install **"esp8266 by ESP8266 Community"** (version 3.0.0 or later)
4. Wait for installation to complete

### Step 4: Select Board and Port

1. Go to **Tools → Board → ESP8266 Boards**
2. Select **"NodeMCU 1.0 (ESP-12E Module)"**
3. Go to **Tools → Port**
4. Select your ESP8266's COM port (e.g., `/dev/ttyUSB0` on Linux, `COM3` on Windows)

### Step 5: Configure Board Settings

Set these in **Tools** menu:
- **Board**: NodeMCU 1.0 (ESP-12E Module)
- **Upload Speed**: 115200
- **CPU Frequency**: 80 MHz
- **Flash Size**: 4MB (FS:2MB OTA:~1019KB)
- **Debug Level**: None
- **Port**: [Your ESP8266 port]

---

## 📤 Uploading Code

### Step 1: Open the Code

1. Open `ESP8266_SmartMeter.ino` in Arduino IDE
2. The code should appear in the editor

### Step 2: Verify Code

1. Click the **✓ Verify** button (or press `Ctrl+R` / `Cmd+R`)
2. Wait for compilation
3. Should see "Done compiling" if successful

### Step 3: Upload to ESP8266

1. **Hold the BOOT button** on your ESP8266 (if present)
2. Click the **→ Upload** button (or press `Ctrl+U` / `Cmd+U`)
3. **Release BOOT button** when you see "Connecting..."
4. Wait for upload to complete
5. You should see "Done uploading"

### Step 4: Open Serial Monitor

1. Go to **Tools → Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
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

## 🧪 Testing the Hardware

### Test 1: Check Wi-Fi Access Point

1. On your phone/computer, open Wi-Fi settings
2. Look for network: **"SmartMeter_Node1"**
3. Password: **"12345678"**
4. Connect to it
5. ✅ If connected, hardware is working!

### Test 2: Test API Endpoint

1. Open a web browser
2. Navigate to: `http://192.168.4.1/data`
3. You should see JSON response:
   ```json
   {"current":2.5,"raw_adc":512,"status":"NORMAL","timestamp":12345}
   ```
4. ✅ If you see JSON, API is working!

### Test 3: Test Potentiometer

1. Rotate the potentiometer slowly
2. Refresh `http://192.168.4.1/data` in browser
3. Watch the `current` and `raw_adc` values change
4. ✅ If values change, potentiometer is working!

### Test 4: Check Status Changes

1. Rotate potentiometer to maximum (clockwise)
2. Check if `status` changes to `"PEAK"` (when current > 3.0A)
3. Rotate back to minimum
4. Check if `status` changes to `"NORMAL"`
5. ✅ If status changes, threshold detection is working!

---

## 🌐 Connecting to Dashboard

### Step 1: Start Next.js Dashboard

1. Open terminal in project directory
2. Run:
   ```bash
   npm run dev
   ```
3. Dashboard starts at `http://localhost:3000`

### Step 2: Connect Device to ESP8266 Wi-Fi

**On your MacBook/iPhone:**
1. Open Wi-Fi settings
2. Connect to: **SmartMeter_Node1**
3. Password: **12345678**
4. Wait for connection

### Step 3: Open Dashboard

1. Open browser
2. Go to: `http://localhost:3000`
3. Dashboard should load

### Step 4: Verify Connection

1. Look at the header - should show **"Live"** badge (green)
2. Check **Current Load** card - should show live values
3. Rotate potentiometer - values should update in real-time
4. ✅ If updating, everything is connected!

---

## 🔧 Troubleshooting

### Problem: ESP8266 Not Detected

**Solutions:**
- Install USB drivers (CH340 or CP2102)
- Try different USB cable (data cable, not charge-only)
- Check Device Manager (Windows) or `ls /dev/tty*` (Mac/Linux)
- Try different USB port

### Problem: Upload Fails

**Solutions:**
- Hold BOOT button during upload
- Lower upload speed to 115200
- Press RESET button on ESP8266
- Check USB cable connection

### Problem: Can't Connect to Wi-Fi

**Solutions:**
- Check Serial Monitor for AP IP address
- Verify SSID: "SmartMeter_Node1"
- Verify password: "12345678"
- Try forgetting network and reconnecting
- Restart ESP8266 (unplug/replug)

### Problem: API Not Responding

**Solutions:**
- Check Serial Monitor for "HTTP server started"
- Verify you're connected to ESP8266 Wi-Fi
- Try accessing `http://192.168.4.1/data` directly
- Check browser console for CORS errors
- Restart ESP8266

### Problem: Dashboard Shows "Offline"

**Solutions:**
- Verify device is connected to "SmartMeter_Node1" Wi-Fi
- Check if `http://192.168.4.1/data` works in browser
- Check browser console (F12) for errors
- Verify ESP8266 is powered on
- Try refreshing dashboard

### Problem: Values Not Updating

**Solutions:**
- Rotate potentiometer more (check if it's working)
- Check Serial Monitor for ADC readings
- Verify A0 pin connection
- Check potentiometer wiring (VCC, GND, Wiper)
- Try different potentiometer

### Problem: CORS Errors

**Solutions:**
- ESP8266 code already includes CORS headers
- Check Serial Monitor for errors
- Try different browser
- Clear browser cache
- Verify ESP8266 code is uploaded correctly

---

## 📊 Understanding the Readings

### ADC Values:
- **Range**: 0-1023 (10-bit ADC)
- **0**: Minimum (potentiometer at 0%)
- **1023**: Maximum (potentiometer at 100%)

### Current Calculation:
```
current = (raw_adc / 1023.0) * MAX_CURRENT
```
- **MAX_CURRENT**: 5.0 Amperes (configurable in code)
- **Example**: ADC 512 → Current = 2.5A

### Status Threshold:
- **NORMAL**: current ≤ 3.0A
- **PEAK**: current > 3.0A

---

## 🎯 Quick Reference

### ESP8266 Pinout (NodeMCU):
```
     [USB Port]
        │
    ┌───┴───┐
    │       │
  3.3V    GND
   A0     D0
   D1     D2
   ...    ...
```

### Potentiometer:
- **Left Pin**: VCC (3.3V)
- **Middle Pin**: Wiper (to A0)
- **Right Pin**: GND

### Network Info:
- **SSID**: SmartMeter_Node1
- **Password**: 12345678
- **IP Address**: 192.168.4.1
- **API Endpoint**: http://192.168.4.1/data

---

## ✅ Final Checklist

Before your review/demo:

- [ ] ESP8266 code uploaded successfully
- [ ] Serial Monitor shows "HTTP server started"
- [ ] Can connect to "SmartMeter_Node1" Wi-Fi
- [ ] `http://192.168.4.1/data` returns JSON
- [ ] Potentiometer rotation changes values
- [ ] Dashboard shows "Live" status
- [ ] Dashboard updates in real-time
- [ ] Status changes from NORMAL to PEAK
- [ ] Chart updates smoothly

---

## 🚀 Ready for Demo!

Once all checkboxes are complete, you're ready to demonstrate:

1. **Show the hardware** - ESP8266 + potentiometer
2. **Connect to Wi-Fi** - Show "SmartMeter_Node1" network
3. **Open dashboard** - Show real-time updates
4. **Rotate potentiometer** - Show live value changes
5. **Explain architecture** - ESP8266 AP mode → Dashboard

**Demo Script:**
> "The ESP8266 runs in access-point mode and exposes live meter data through a REST API. The dashboard connects directly over local Wi-Fi and updates in real time without using the internet."

Good luck with your review! 🎉
