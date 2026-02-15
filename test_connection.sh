#!/bin/bash

# Test ESP8266 Connection Script

PORT="/dev/tty.usbserial-A5069RR4"
BAUD=115200

echo "🔍 Testing ESP8266 Connection..."
echo ""

# Check if port exists
if [ ! -e "$PORT" ]; then
    echo "❌ Port $PORT not found!"
    echo ""
    echo "Please:"
    echo "1. Connect FTDI FT232R to your Mac"
    echo "2. Check: ls /dev/tty.usbserial*"
    exit 1
fi

echo "✅ Port found: $PORT"
echo ""

# Check permissions
if [ ! -r "$PORT" ] || [ ! -w "$PORT" ]; then
    echo "⚠️  Permission issue detected"
    echo "Trying with sudo..."
    echo ""
    sudo chmod 666 "$PORT" 2>/dev/null
fi

# Try to read from port (non-blocking)
echo "📡 Attempting to read from ESP8266..."
echo "   (Press Ctrl+C to stop)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Use cat to read (will show any data)
timeout 3 cat "$PORT" 2>&1 || {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "💡 No data received. This could mean:"
    echo "   1. ESP8266 is not powered on"
    echo "   2. Wiring is incorrect"
    echo "   3. ESP8266 code is not uploaded"
    echo "   4. Wrong baud rate"
    echo ""
    echo "🔧 Try connecting with screen:"
    echo "   screen $PORT $BAUD"
    echo ""
}
