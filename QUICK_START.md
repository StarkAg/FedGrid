# Quick Start Guide

Get your Fedgrid dashboard running in 5 minutes!

## Step 1: Upload ESP8266 Code

1. Open `ESP8266_SmartMeter.ino` in Arduino IDE
2. Install ESP8266 board support (if not already installed):
   - File → Preferences → Additional Board Manager URLs
   - Add: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - Tools → Board → Boards Manager → Search "ESP8266" → Install
3. Select your board:
   - Tools → Board → ESP8266 Boards → NodeMCU 1.0 (ESP-12E Module)
   - Tools → Port → Select your ESP8266 port
4. Click Upload
5. Open Serial Monitor (115200 baud)
6. You should see:
   ```
   AP IP Address: 192.168.4.1
   ```

## Step 2: Connect to ESP8266 Wi-Fi

On your MacBook/iPhone:
1. Open Wi-Fi settings
2. Connect to: **SmartMeter_Node1**
3. Password: **12345678**

## Step 3: Test ESP8266 API

Open browser and go to:
```
http://192.168.4.1/data
```

You should see JSON like:
```json
{"current":2.5,"raw_adc":512,"status":"NORMAL","timestamp":12345}
```

**Rotate the potentiometer** - the values should change!

## Step 4: Start Next.js Dashboard

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open browser: `http://localhost:3000`

## Step 5: Watch It Work! 🎉

1. Rotate the potentiometer on ESP8266
2. Watch the dashboard update in real-time:
   - Current load value changes
   - Status badge changes color (Green → Red when > 3.0A)
   - Chart updates with new data points
   - All cards refresh automatically

## Troubleshooting

### "Connection Error" in Dashboard
- ✅ Make sure device is connected to `SmartMeter_Node1` Wi-Fi
- ✅ Check Serial Monitor - ESP8266 should show "HTTP server started"
- ✅ Test `http://192.168.4.1/data` directly in browser first
- ✅ Check browser console (F12) for specific error messages

### CORS Errors
- ✅ ESP8266 code includes CORS headers (already in the .ino file)
- ✅ If still seeing errors, check browser console for details

### Dashboard Not Updating
- ✅ Check browser console for fetch errors
- ✅ Verify ESP8266 is responding (test `/data` endpoint directly)
- ✅ Check network tab in browser DevTools to see if requests are being made

### ESP8266 Not Creating AP
- ✅ Check Serial Monitor for error messages
- ✅ Try resetting ESP8266 (press reset button)
- ✅ Verify board selection in Arduino IDE matches your hardware

## Demo Script (30 seconds)

> "This ESP8266 runs in access-point mode and exposes live meter data through a REST API. The dashboard reads this in real time without using the internet."

*[Rotate potentiometer]*

> "As you can see, when I change the load, the dashboard updates instantly - showing the current value, status, and chart visualization."

## Hardware Setup

```
Potentiometer → ESP8266
───────────────────────
VCC          → 3.3V
GND          → GND
Wiper (mid)  → A0
```

That's it! You're ready for your review! 🚀
