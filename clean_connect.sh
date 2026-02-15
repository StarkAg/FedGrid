#!/bin/bash

# Clean connection - kills stuck processes first

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    exit 1
fi

echo "🧹 Cleaning up..."
# Kill all screen/cu processes using serial ports
pkill -f "screen.*usbserial" 2>/dev/null
pkill -f "cu.*usbserial" 2>/dev/null
lsof -ti "$PORT" | xargs kill -9 2>/dev/null
sleep 2

echo "✅ Cleaned!"
echo ""
echo "📡 Connecting to ESP8266..."
echo "   Port: $PORT"
echo "   Baud: $BAUD"
echo ""
echo "💡 IMPORTANT:"
echo "   → Press RESET button on ESP8266 NOW"
echo "   → You should see boot messages"
echo ""
echo "💡 To exit: Ctrl+A, then K, then Y"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

screen "$PORT" $BAUD
