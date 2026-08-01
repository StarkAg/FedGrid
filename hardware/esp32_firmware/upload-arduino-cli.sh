#!/usr/bin/env bash
# Build and upload FedGrid ESP32 firmware using Arduino CLI.
# Usage: ./upload-arduino-cli.sh [PORT]
#   PORT = serial port (e.g. /dev/cu.usbserial-0001). If omitted, first ESP32 port is used.
# List ports: ./ports.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
SKETCH_DIR="$SCRIPT_DIR/FedGrid_Meter"
FQBN="esp32:esp32:esp32"

if ! command -v arduino-cli >/dev/null 2>&1; then
  echo "arduino-cli not found. Install: brew install arduino-cli"
  exit 1
fi

# Use project library (libraries/LiquidCrystal_I2C = iakop fork with lcd.init())
LIBRARIES_PATH="$SCRIPT_DIR/libraries"
CONFIG_FILE="$SCRIPT_DIR/arduino-cli.yml"
if [[ ! -d "$LIBRARIES_PATH/LiquidCrystal_I2C" ]]; then
  echo "Project library not found. Ensure libraries/LiquidCrystal_I2C exists (from iakop/LiquidCrystal_I2C_ESP32)."
  exit 1
fi

arduino-cli core update-index 2>/dev/null || true
if ! arduino-cli core list 2>/dev/null | grep -q "esp32:esp32"; then
  echo "Installing ESP32 core..."
  arduino-cli core install esp32:esp32
fi

echo "Compiling (using lcd.init() library)..."
arduino-cli compile --config-file "$CONFIG_FILE" --fqbn "$FQBN" "$SKETCH_DIR"
echo "Compile OK."

PORT="$1"
if [[ -z "$PORT" ]]; then
  PORT=$(arduino-cli board list 2>/dev/null | grep -E '^/dev/|^COM[0-9]' | head -1 | awk '{print $1}')
  if [[ -z "$PORT" ]]; then
    echo "No port specified and no board found. Run: ./ports.sh"
    echo "Then: $0 /dev/cu.usbserial-0001"
    exit 1
  fi
  echo "Using port: $PORT"
fi

echo "Uploading to $PORT..."
arduino-cli upload -p "$PORT" --fqbn "$FQBN" "$SKETCH_DIR"
echo "Done."
