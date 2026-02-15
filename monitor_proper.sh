#!/bin/bash

# Proper Serial Monitor with correct port configuration

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    exit 1
fi

echo "🧹 Cleaning up..."
lsof -ti "$PORT" 2>/dev/null | xargs kill -9 2>/dev/null
pkill -f "screen.*usbserial" 2>/dev/null
pkill -f "cu.*usbserial" 2>/dev/null
sleep 2

echo "✅ Cleaned!"
echo ""
echo "📡 ESP8266 Serial Monitor (Proper Config)"
echo "=========================================="
echo "Port: $PORT"
echo "Baud: $BAUD"
echo ""
echo "💡 Press RESET on ESP8266 NOW"
echo "💡 Press Ctrl+C to exit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configure port properly before reading
stty -f "$PORT" $BAUD cs8 -cstopb -parenb raw -echo 2>/dev/null

# Use cat with proper settings
cat "$PORT" 2>&1
