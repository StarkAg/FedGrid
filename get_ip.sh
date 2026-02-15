#!/bin/bash

# Get ESP8266 IP Address from Serial Monitor

PORT=$(ls /dev/cu.usbserial* /dev/tty.usbserial* 2>/dev/null | head -1)
BAUD=115200

if [ -z "$PORT" ]; then
    echo "❌ No serial port found!"
    exit 1
fi

echo "📡 Connecting to ESP8266 to get IP address..."
echo "   Port: $PORT"
echo ""
echo "💡 Press RESET button on ESP8266 if needed"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try to read for 15 seconds
timeout 15 screen -L /dev/cu.usbserial-10 115200 2>&1 | tee /tmp/esp8266_output.txt

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract IP address
IP=$(grep -i "IP Address:" /tmp/esp8266_output.txt 2>/dev/null | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | head -1)

if [ -n "$IP" ]; then
    echo "✅ Found ESP8266 IP: $IP"
    echo ""
    echo "📝 Update config/esp8266.ts:"
    echo "   export const ESP8266_IP = '$IP';"
    echo ""
    echo "🔗 API Endpoint: http://$IP/data"
else
    echo "⚠️  Could not find IP address in output"
    echo ""
    echo "Try:"
    echo "   1. Press RESET on ESP8266"
    echo "   2. Run: ./monitor_esp8266.sh"
    echo "   3. Look for 'IP Address: ...'"
fi

rm -f /tmp/esp8266_output.txt 2>/dev/null
