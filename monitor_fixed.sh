#!/bin/bash

# Fixed Serial Monitor - Uses cu instead of screen

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    exit 1
fi

echo "📡 ESP8266 Serial Monitor (Fixed)"
echo "=================================="
echo "Port: $PORT"
echo "Baud: $BAUD"
echo ""
echo "💡 Press RESET on ESP8266 to see boot messages"
echo "💡 To exit: Type ~. and press Enter"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Use cu (built-in Mac tool, no PTY issues)
cu -l "$PORT" -s $BAUD
