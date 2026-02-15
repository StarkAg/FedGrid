#!/bin/bash

# ESP8266 Upload Script using arduino-cli

echo "🚀 ESP8266 Code Upload Script"
echo "=============================="
echo ""

# Check if arduino-cli is installed
if ! command -v arduino-cli &> /dev/null; then
    echo "❌ arduino-cli not found!"
    echo ""
    echo "📥 Installing arduino-cli..."
    echo ""
    
    # Install arduino-cli via Homebrew
    if command -v brew &> /dev/null; then
        echo "Installing via Homebrew..."
        brew install arduino-cli
    else
        echo "Homebrew not found. Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        brew install arduino-cli
    fi
    
    echo ""
    echo "✅ arduino-cli installed!"
    echo ""
fi

# Initialize arduino-cli config
echo "⚙️  Initializing arduino-cli..."
arduino-cli config init 2>/dev/null || true

# Add ESP8266 board URL
echo "📦 Adding ESP8266 board support..."
arduino-cli config add board_manager.additional_urls http://arduino.esp8266.com/stable/package_esp8266com_index.json

# Update board index
echo "🔄 Updating board index..."
arduino-cli core update-index

# Install ESP8266 core
echo "📥 Installing ESP8266 core..."
arduino-cli core install esp8266:esp8266

# Find ESP8266 port
echo "🔍 Detecting ESP8266 port..."
PORTS=$(ls /dev/cu.usbserial* /dev/cu.usbmodem* /dev/tty.usbserial* /dev/tty.usbmodem* 2>/dev/null)
if [ -z "$PORTS" ]; then
    echo "❌ No serial port found!"
    echo ""
    echo "Please:"
    echo "1. Connect ESP8266 to Mac via USB"
    echo "2. Or connect FTDI adapter"
    echo ""
    exit 1
fi

PORT=$(echo $PORTS | awk '{print $1}')
echo "✅ Found port: $PORT"
echo ""

# Set board and port (try NodeMCU 1.0 first, fallback to generic)
BOARD="esp8266:esp8266:nodemcuv2"
# Alternative: "esp8266:esp8266:generic" if nodemcuv2 doesn't work
SKETCH_FILE="ESP8266_SmartMeter.ino"
SKETCH_DIR="ESP8266_SmartMeter"

# Create sketch directory if needed
if [ ! -d "$SKETCH_DIR" ]; then
    echo "📁 Creating sketch directory..."
    mkdir -p "$SKETCH_DIR"
    cp "$SKETCH_FILE" "$SKETCH_DIR/$SKETCH_FILE" 2>/dev/null || {
        echo "❌ Could not copy sketch file!"
        exit 1
    }
fi

if [ ! -f "$SKETCH_DIR/$SKETCH_FILE" ]; then
    echo "❌ Sketch file not found in $SKETCH_DIR/"
    exit 1
fi

echo "📋 Upload Configuration:"
echo "   Board: $BOARD"
echo "   Port: $PORT"
echo "   Sketch: $SKETCH_DIR/"
echo ""

# Compile
echo "🔨 Compiling code..."
arduino-cli compile --fqbn "$BOARD" "$SKETCH_DIR"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Compilation failed!"
    echo "Check the errors above"
    exit 1
fi

echo ""
echo "✅ Compilation successful!"
echo ""

# Upload
echo "📤 Uploading to ESP8266..."
echo "   (This may take 30-60 seconds)"
echo ""

arduino-cli upload -p "$PORT" --fqbn "$BOARD" "$SKETCH_DIR"

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Upload successful!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📡 Next steps:"
    echo "   1. Open Serial Monitor:"
    echo "      screen $PORT 115200"
    echo ""
    echo "   2. Or use Arduino IDE Serial Monitor"
    echo ""
    echo "   3. You should see:"
    echo "      'HTTP server started'"
    echo ""
else
    echo ""
    echo "❌ Upload failed!"
    echo ""
    echo "💡 Troubleshooting:"
    echo "   - Press RESET button on ESP8266"
    echo "   - Try different USB port"
    echo "   - Check USB cable (data cable, not charge-only)"
    echo "   - Hold BOOT button during upload"
    exit 1
fi
