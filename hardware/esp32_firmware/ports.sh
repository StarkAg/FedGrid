#!/usr/bin/env bash
# List serial ports (ESP32 and other boards). Uses Arduino CLI.
set -e
cd "$(dirname "$0")"
if ! command -v arduino-cli >/dev/null 2>&1; then
  echo "arduino-cli not found. Install: brew install arduino-cli"
  exit 1
fi
arduino-cli board list
