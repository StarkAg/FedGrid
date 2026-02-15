#!/usr/bin/env bash
# Run from FedGrid project root. Start FL server first, then run 2+ clients in other terminals.

set -e
cd "$(dirname "$0")"
python -m backend.federated_server
