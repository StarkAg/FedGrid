#!/usr/bin/env bash
# Build and upload FedGrid ESP32 firmware. Run from repo root or from this directory.
set -e
cd "$(dirname "$0")"
exec pio run -t upload "$@"
