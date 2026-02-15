#!/bin/bash

# Auto-connect script with better error handling

# Auto-detect port (try multiple common names)
PORT=$(ls /dev/tty.usbserial* /dev/cu.usbserial* 2>/dev/null | head -1)

if [ -z "$PORT" ]; then
    PORT="/dev/tty.usbserial-A5069RR4"  # Fallback
fi
BAUD=115200

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔌 ESP8266 Auto-Connect${NC}"
echo "================================"
echo ""

# Check port
if [ ! -e "$PORT" ]; then
    echo -e "${RED}❌ Port not found!${NC}"
    echo "Connect FTDI adapter and try again"
    exit 1
fi

# Clear stuck processes
echo "Clearing any stuck connections..."
pkill -f "screen.*usbserial" 2>/dev/null
sleep 1

# Check if port is busy
if lsof "$PORT" &>/dev/null; then
    echo -e "${YELLOW}⚠️  Port is busy, clearing...${NC}"
    lsof -ti "$PORT" | xargs kill -9 2>/dev/null
    sleep 2
fi

# Configure port
echo "Configuring port..."
stty -f "$PORT" $BAUD cs8 -cstopb -parenb raw -echo 2>/dev/null

echo ""
echo -e "${GREEN}✅ Ready to connect${NC}"
echo ""
echo "Connecting in 2 seconds..."
echo "Press Ctrl+A, then K, then Y to exit"
sleep 2

# Try cu first (more reliable on Mac)
if command -v cu &> /dev/null; then
    echo "Using 'cu' command..."
    cu -l "$PORT" -s $BAUD
else
    echo "Using 'screen' command..."
    screen "$PORT" $BAUD
fi
