#!/bin/bash

# Quick ESP8266 Serial Monitor

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    echo "Connect ESP8266 or FTDI adapter"
    exit 1
fi

echo "📡 Connecting to ESP8266..."
echo "   Port: $PORT"
echo "   Baud: $BAUD"
echo ""
echo "💡 Press Ctrl+A, then K, then Y to exit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

screen "$PORT" $BAUD
