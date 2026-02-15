#!/bin/bash

# Upload Arduino R4 Code

SKETCH_DIR="ArduinoR4_SmartMeter"
PORT=$(ls /dev/cu.usbmodem* /dev/tty.usbmodem* 2>/dev/null | head -1)

if [ -z "$PORT" ]; then
    echo "❌ No Arduino R4 port found!"
    echo "Looking for: /dev/cu.usbmodem* or /dev/tty.usbmodem*"
    exit 1
fi

echo "🚀 Arduino R4 Code Upload Script"
echo "=================================="
echo ""
echo "📋 Upload Configuration:"
echo "   Board: Arduino UNO R4 WiFi"
echo "   Port: $PORT"
echo "   Sketch: $SKETCH_DIR/"
echo ""
echo "📤 Uploading..."
echo ""

# Use arduino-cli if available, otherwise provide instructions
if command -v arduino-cli &> /dev/null; then
    arduino-cli upload -p "$PORT" --fqbn arduino:renesas_uno:unor4wifi "$SKETCH_DIR"
else
    echo "⚠️  arduino-cli not found"
    echo ""
    echo "Please upload manually using Arduino IDE:"
    echo "  1. Open Arduino IDE"
    echo "  2. Open: $SKETCH_DIR/ArduinoR4_SmartMeter.ino"
    echo "  3. Select Board: Arduino UNO R4 WiFi"
    echo "  4. Select Port: $PORT"
    echo "  5. Click Upload"
    exit 1
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Upload successful!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📡 Next steps:"
    echo "   1. Open Serial Monitor (115200 baud)"
    echo "   2. Press RESET on Arduino R4"
    echo "   3. Check for Wi-Fi connection"
    echo ""
else
    echo ""
    echo "❌ Upload failed!"
    echo "Try uploading via Arduino IDE instead"
    exit 1
fi
