#!/usr/bin/env bash
# Start FL server, 2 clients, and Flask API in background. Run from project root.
# Dashboard: run separately (npm run dev or npm start).
set -e
cd "$(dirname "$0")/.."
ROOT="$PWD"

stop_all() {
  echo "Stopping existing FedGrid processes..."
  pkill -f "backend.federated_server" 2>/dev/null || true
  pkill -f "client.client" 2>/dev/null || true
  pkill -f "backend.server" 2>/dev/null || true
  sleep 2
}

start_fl_server() {
  echo "Starting FL server (port 8085)..."
  cd "$ROOT"
  source venv/bin/activate 2>/dev/null || true
  nohup python -m backend.federated_server > fl_server.log 2>&1 &
  echo $! > fl_server.pid
  sleep 3
}

start_clients() {
  echo "Starting 2 FL clients..."
  cd "$ROOT"
  source venv/bin/activate 2>/dev/null || true
  nohup python -m client.client --id 1 --server 127.0.0.1:8085 >> client1.log 2>&1 &
  nohup python -m client.client --id 2 --server 127.0.0.1:8085 >> client2.log 2>&1 &
  sleep 2
}

start_api() {
  echo "Starting Flask API (port 5000)..."
  cd "$ROOT"
  source venv/bin/activate 2>/dev/null || true
  nohup python -m backend.server > api.log 2>&1 &
  echo $! > api.pid
  sleep 1
}

case "${1:-start}" in
  start)
    stop_all
    start_fl_server
    start_clients
    start_api
    echo ""
    echo "FedGrid started. FL server: 8085, API: 5000."
    echo "Run clients again after each FL run (server runs 5 rounds then exits)."
    echo "Dashboard: npm run dev (or npm start) in another terminal."
    ;;
  stop)
    stop_all
    echo "Stopped."
    ;;
  *)
    echo "Usage: $0 start|stop"
    exit 1
    ;;
esac
