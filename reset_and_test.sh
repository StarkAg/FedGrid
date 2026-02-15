#!/bin/bash

# Reset ESP8266 and Test Connection

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    exit 1
fi

echo "🔧 ESP8266 Reset and Test"
echo "========================"
echo ""
echo "Port: $PORT"
echo ""

# Kill any stuck processes
echo "1️⃣  Clearing stuck connections..."
pkill -f "screen.*usbserial" 2>/dev/null
sleep 1
echo "   ✅ Cleared"
echo ""

# Configure port
echo "2️⃣  Configuring serial port..."
stty -f "$PORT" $BAUD cs8 -cstopb -parenb raw -echo 2>/dev/null
echo "   ✅ Configured"
echo ""

# Instructions
echo "3️⃣  Reset ESP8266:"
echo "   → Press RESET button on ESP8266"
echo "   → Or unplug/replug power"
echo ""
echo "4️⃣  Then connect with:"
echo "   screen $PORT $BAUD"
echo ""
echo "   OR run:"
echo "   ./monitor_esp8266.sh"
echo ""

# Try to read boot messages
echo "5️⃣  Attempting to read boot messages (5 seconds)..."
echo "   (Press RESET on ESP8266 now if you haven't)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Use cat with a timeout equivalent
(cat "$PORT" &)
CAT_PID=$!
sleep 5
kill $CAT_PID 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 If you saw output above, ESP8266 is working!"
echo "💡 If not, try:"
echo "   1. Press RESET button on ESP8266"
echo "   2. Check ESP8266 is powered (LED on)"
echo "   3. Verify wiring is correct"
echo ""
