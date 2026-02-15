#!/bin/bash

# Simple ESP8266 Connection - Clears port first

PORT="/dev/tty.usbserial-A5069RR4"
BAUD=115200

echo "🔧 Clearing any stuck connections..."
pkill -f "screen.*usbserial" 2>/dev/null
sleep 1

echo "🔌 Connecting to ESP8266..."
echo "📡 Port: $PORT"
echo "⚡ Baud Rate: $BAUD"
echo ""
echo "💡 Make sure:"
echo "   1. ESP8266 is powered ON"
echo "   2. FTDI wiring: GND, TX→RX, RX→TX"
echo "   3. ESP8266 code is uploaded"
echo ""
echo "Press Ctrl+A, then K, then Y to exit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try using cu instead (more reliable on Mac)
if command -v cu &> /dev/null; then
    echo "Using 'cu' command..."
    cu -l $PORT -s $BAUD
else
    echo "Using 'screen' command..."
    screen $PORT $BAUD
fi
