#!/bin/bash

# Complete ESP8266 Setup Verification Script

echo "🔍 Fedgrid ESP8266 Setup Verification"
echo "======================================"
echo ""

# Check 1: ESP8266 Code File
echo "1️⃣  Checking ESP8266 code..."
if [ -f "ESP8266_SmartMeter.ino" ]; then
    echo "   ✅ Code file exists: ESP8266_SmartMeter.ino"
    CODE_LINES=$(wc -l < ESP8266_SmartMeter.ino)
    echo "   ✅ Code has $CODE_LINES lines"
else
    echo "   ❌ Code file not found!"
    exit 1
fi
echo ""

# Check 2: Serial Ports
echo "2️⃣  Checking for serial ports..."
PORTS=$(ls /dev/tty.usbserial* /dev/tty.usbmodem* /dev/cu.usbserial* /dev/cu.usbmodem* 2>/dev/null)
if [ -n "$PORTS" ]; then
    echo "   ✅ Found serial ports:"
    for port in $PORTS; do
        echo "      - $port"
    done
    MAIN_PORT=$(echo $PORTS | awk '{print $1}')
else
    echo "   ⚠️  No serial ports found"
    echo "   → Connect ESP8266 or FTDI adapter"
    MAIN_PORT=""
fi
echo ""

# Check 3: Next.js Setup
echo "3️⃣  Checking Next.js setup..."
if [ -f "package.json" ]; then
    echo "   ✅ package.json exists"
    if [ -d "node_modules" ]; then
        echo "   ✅ Dependencies installed"
    else
        echo "   ⚠️  Run: npm install"
    fi
else
    echo "   ❌ package.json not found"
fi
echo ""

# Check 4: Dashboard Files
echo "4️⃣  Checking dashboard files..."
FILES=("app/page.tsx" "components/Header.tsx" "components/SummaryCards.tsx")
ALL_OK=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file missing"
        ALL_OK=false
    fi
done
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Setup Status:"
echo ""

if [ -n "$MAIN_PORT" ]; then
    echo "✅ Serial port ready: $MAIN_PORT"
    echo ""
    echo "🚀 To connect, run:"
    echo "   screen $MAIN_PORT 115200"
    echo ""
    echo "   OR use:"
    echo "   ./auto_connect.sh"
else
    echo "⚠️  No serial port detected"
    echo ""
    echo "💡 Options:"
    echo "   1. Connect ESP8266 via USB → Use Arduino IDE"
    echo "   2. Connect FTDI adapter → Then run this script again"
fi

echo ""
echo "📝 Next Steps:"
echo "   1. Upload ESP8266_SmartMeter.ino via Arduino IDE"
echo "   2. Test in Arduino IDE Serial Monitor (115200 baud)"
echo "   3. Connect to Wi-Fi: SmartMeter_Node1"
echo "   4. Start dashboard: npm run dev"
echo "   5. Open: http://localhost:3000"
echo ""
