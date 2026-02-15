#!/bin/bash

# Clean Serial Monitor - Kills stuck processes first

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    exit 1
fi

echo "🧹 Cleaning up stuck processes..."
# Kill all processes using the port
lsof -ti "$PORT" 2>/dev/null | xargs kill -9 2>/dev/null
pkill -f "screen.*usbserial" 2>/dev/null
pkill -f "cu.*usbserial" 2>/dev/null
sleep 2

echo "✅ Cleaned!"
echo ""
echo "📡 ESP8266 Serial Monitor"
echo "========================"
echo "Port: $PORT"
echo "Baud: $BAUD"
echo ""
echo "💡 Press RESET on ESP8266 NOW"
echo "💡 Press Ctrl+C to exit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Use cat (simplest, no locks)
cat "$PORT" 2>&1
