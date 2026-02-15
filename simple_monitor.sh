#!/bin/bash

# Simple Serial Monitor without screen

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    exit 1
fi

echo "📡 ESP8266 Serial Monitor"
echo "========================"
echo "Port: $PORT"
echo "Baud: $BAUD"
echo ""
echo "💡 Press Ctrl+C to exit"
echo "💡 Press RESET on ESP8266 to see boot messages"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Use cat to read serial port
cat "$PORT" 2>&1
