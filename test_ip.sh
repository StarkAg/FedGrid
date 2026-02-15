#!/bin/bash

# Test common IP addresses to find ESP8266

echo "🔍 Testing common IP addresses..."
echo ""

# Test range 100-110
for i in {100..110}; do
    IP="192.168.1.$i"
    echo -n "Testing $IP... "
    
    RESPONSE=$(curl -s --connect-timeout 1 "http://$IP/data" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
        echo "✅ FOUND!"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ ESP8266 IP: $IP"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Response: $RESPONSE"
        echo ""
        echo "📝 Update config/esp8266.ts:"
        echo "   export const ESP8266_IP = '$IP';"
        echo ""
        exit 0
    else
        echo "❌"
    fi
done

# Try 192.168.0.x range
for i in {100..110}; do
    IP="192.168.0.$i"
    echo -n "Testing $IP... "
    
    RESPONSE=$(curl -s --connect-timeout 1 "http://$IP/data" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
        echo "✅ FOUND!"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ ESP8266 IP: $IP"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Response: $RESPONSE"
        echo ""
        echo "📝 Update config/esp8266.ts:"
        echo "   export const ESP8266_IP = '$IP';"
        echo ""
        exit 0
    else
        echo "❌"
    fi
done

echo ""
echo "⚠️  ESP8266 not found in common IP ranges"
echo ""
echo "Try:"
echo "   1. Arduino IDE Serial Monitor (easiest!)"
echo "   2. Check router admin page"
echo "   3. Make sure ESP8266 is connected to Wi-Fi"
echo "   4. Press RESET button on ESP8266"
echo ""
