#!/bin/bash

# Automated ESP8266 Connection Test
# Tests connection and reads data

PORT="/dev/tty.usbserial-A5069RR4"
BAUD=115200

echo "🔍 ESP8266 Connection Diagnostic Test"
echo "======================================"
echo ""

# Step 1: Check port exists
echo "1️⃣  Checking port..."
if [ ! -e "$PORT" ]; then
    echo "   ❌ Port $PORT not found!"
    echo "   → Connect FTDI adapter to Mac"
    exit 1
fi
echo "   ✅ Port found: $PORT"
echo ""

# Step 2: Check permissions
echo "2️⃣  Checking permissions..."
if [ ! -r "$PORT" ] || [ ! -w "$PORT" ]; then
    echo "   ⚠️  Fixing permissions..."
    sudo chmod 666 "$PORT" 2>/dev/null
fi
echo "   ✅ Permissions OK"
echo ""

# Step 3: Kill any stuck processes
echo "3️⃣  Clearing stuck connections..."
pkill -f "screen.*usbserial" 2>/dev/null
pkill -f "cu.*usbserial" 2>/dev/null
sleep 1
echo "   ✅ Cleared"
echo ""

# Step 4: Configure port
echo "4️⃣  Configuring serial port..."
stty -f "$PORT" $BAUD cs8 -cstopb -parenb raw 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Port configured: $BAUD baud"
else
    echo "   ⚠️  Could not configure (port may be busy)"
fi
echo ""

# Step 5: Test reading
echo "5️⃣  Testing data read (5 seconds)..."
echo "   → If ESP8266 is running, you should see output below"
echo "   → Press Ctrl+C to stop early"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try to read with timeout
timeout 5 cat "$PORT" 2>&1 | head -20 || {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📊 Results:"
    echo ""
    echo "❌ No data received from ESP8266"
    echo ""
    echo "💡 This usually means:"
    echo "   1. ESP8266 code is NOT uploaded"
    echo "   2. ESP8266 is NOT powered on"
    echo "   3. Wiring is incorrect"
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Upload code via Arduino IDE first"
    echo "   2. Verify ESP8266 is powered (LED on)"
    echo "   3. Check wiring: GND, TX→RX, RX→TX"
    echo "   4. Test in Arduino IDE Serial Monitor first"
    echo ""
    exit 1
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Data received! ESP8266 is working!"
echo ""
echo "🚀 You can now connect with:"
echo "   screen $PORT $BAUD"
echo ""
