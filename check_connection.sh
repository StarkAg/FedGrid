#!/bin/bash

# Check if Mac can reach Arduino R4

echo "🔍 Checking Connection to Arduino R4"
echo "====================================="
echo ""

# Check Mac IP
echo "📱 Mac IP Address:"
MAC_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "   $MAC_IP"
echo ""

# Check if on same network
if [[ $MAC_IP == 172.20.10.* ]]; then
    echo "✅ Mac is on iPhone hotspot network (172.20.10.x)"
else
    echo "⚠️  Mac is NOT on iPhone hotspot network"
    echo "   Mac IP: $MAC_IP"
    echo "   Expected: 172.20.10.x"
    echo ""
    echo "💡 Connect Mac to iPhone hotspot!"
fi

echo ""

# Test Arduino R4 connection
echo "📡 Testing Arduino R4 connection..."
echo "   Target: http://172.20.10.2/data"
echo ""

RESPONSE=$(curl -s --connect-timeout 3 http://172.20.10.2/data 2>&1)

if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
    echo "✅ SUCCESS! Arduino R4 is reachable!"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | head -3
    echo ""
    echo "🎉 Everything is working!"
else
    echo "❌ Cannot reach Arduino R4"
    echo ""
    echo "Error: $RESPONSE"
    echo ""
    echo "💡 Make sure:"
    echo "   1. Mac is connected to iPhone hotspot"
    echo "   2. Arduino R4 is connected to same iPhone hotspot"
    echo "   3. iPhone hotspot is enabled"
fi

echo ""
