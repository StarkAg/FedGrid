#!/usr/bin/env bash
# Run from FedGrid project root. Usage: ./run_fl_client.sh 1   (or 2, 3)
# Start backend.federated_server first.

set -e
cd "$(dirname "$0")"
CLIENT_ID="${1:-1}"
python -m client.client --id "$CLIENT_ID" --server 127.0.0.1:8085
