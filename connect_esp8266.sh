#!/bin/bash

# ESP8266 Serial Connection Script
# Connects to ESP8266 via FTDI FT232R USB UART

# Auto-detect FTDI port (try both tty and cu)
PORT=$(ls /dev/tty.usbserial* /dev/cu.usbserial* 2>/dev/null | head -1)

if [ -z "$PORT" ]; then
    echo "❌ No FTDI USB serial port found!"
    echo ""
    echo "Please:"
    echo "1. Connect FTDI FT232R to your Mac"
    echo "2. Check connection: ls /dev/tty.usbserial*"
    exit 1
fi

BAUD=115200

echo "🔌 Connecting to ESP8266..."
echo "📡 Port: $PORT"
echo "⚡ Baud Rate: $BAUD"
echo ""
echo "💡 Tips:"
echo "   - Press Ctrl+A, then K, then Y to exit"
echo "   - You should see ESP8266 boot messages"
echo "   - Look for 'HTTP server started' message"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Connect using screen
screen $PORT $BAUD
