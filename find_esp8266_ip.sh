#!/bin/bash

# Alternative method: Find ESP8266 IP on network using arp-scan or nmap

echo "🔍 Finding ESP8266 on network..."
echo ""

# Method 1: Try arp-scan (if available)
if command -v arp-scan &> /dev/null; then
    echo "📡 Scanning network with arp-scan..."
    arp-scan --local | grep -i "esp\|node\|arduino" || echo "No ESP8266 found with arp-scan"
    echo ""
fi

# Method 2: Check router admin page
echo "💡 Alternative: Check your router admin page"
echo "   Look for device named 'ESP8266' or check connected devices"
echo ""

# Method 3: Try common IP ranges
echo "🔍 Trying common IP addresses..."
echo ""

COMMON_IPS=(
    "192.168.1.100"
    "192.168.1.101"
    "192.168.1.102"
    "192.168.1.103"
    "192.168.1.104"
    "192.168.1.105"
    "192.168.0.100"
    "192.168.0.101"
    "192.168.0.102"
)

for ip in "${COMMON_IPS[@]}"; do
    if curl -s --connect-timeout 1 "http://$ip/data" > /dev/null 2>&1; then
        echo "✅ Found ESP8266 at: $ip"
        echo ""
        echo "📝 Update config/esp8266.ts:"
        echo "   export const ESP8266_IP = '$ip';"
        echo ""
        RESPONSE=$(curl -s "http://$ip/data" 2>/dev/null)
        if [ -n "$RESPONSE" ]; then
            echo "📊 Test response: $RESPONSE"
        fi
        exit 0
    fi
done

echo "⚠️  Could not find ESP8266 automatically"
echo ""
echo "Try:"
echo "   1. Use Arduino IDE Serial Monitor (easier!)"
echo "   2. Check router admin page for connected devices"
echo "   3. Press RESET on ESP8266 and check Serial Monitor"
echo ""
