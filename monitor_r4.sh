#!/bin/bash

# Arduino R4 Serial Monitor for Terminal

PORT=$(ls /dev/cu.usbmodem* /dev/tty.usbmodem* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No Arduino R4 port found!"
    echo "Looking for: /dev/cu.usbmodem*"
    exit 1
fi

echo "🧹 Cleaning up stuck processes..."
lsof -ti "$PORT" 2>/dev/null | xargs kill -9 2>/dev/null
pkill -f "screen.*usbmodem" 2>/dev/null
pkill -f "cu.*usbmodem" 2>/dev/null
sleep 2

echo "✅ Cleaned!"
echo ""
echo "📡 Arduino R4 Serial Monitor"
echo "============================="
echo "Port: $PORT"
echo "Baud: $BAUD"
echo ""
echo "💡 Press RESET on Arduino R4 NOW"
echo "💡 Press Ctrl+C to exit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configure port properly
stty -f "$PORT" $BAUD cs8 -cstopb -parenb raw -echo 2>/dev/null

# Use cat to read serial port
cat "$PORT" 2>&1
