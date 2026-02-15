#!/bin/bash

# Start Serial-Based HTTP Proxy
# Uses USB Serial connection - no network needed!

echo "🔗 Starting Serial HTTP Proxy..."
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found!"
    exit 1
fi

# Check if pyserial is installed
if ! python3 -c "import serial" 2>/dev/null; then
    echo "📦 Installing pyserial..."
    pip3 install pyserial
fi

echo "📡 Reading from Arduino R4 via USB Serial"
echo "🌐 Proxy listening on: http://localhost:8080"
echo "📊 Endpoint: http://localhost:8080/data"
echo ""
echo "✅ No network connection needed!"
echo "Press Ctrl+C to stop"
echo ""

python3 arduino_serial_reader.py
