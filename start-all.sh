#!/usr/bin/env bash
# FedGrid — Clean start of all services (no Docker).
# Stops any existing API/dashboard, then starts API + dashboard.
# Usage: ./start-all.sh        (build dashboard, then start both)
#        ./start-all.sh --dev  (use next dev for dashboard, no build)

set -e
cd "$(dirname "$0")"
ROOT="$(pwd)"

# --- Stop existing ---
echo "Stopping any existing FedGrid processes..."
pkill -f "backend.server" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "node.*standalone.*server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2

# --- API (Python) ---
if [[ ! -d "venv" ]]; then
  echo "Creating venv..."
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt

echo "Starting API on http://localhost:5001 ..."
FLASK_PORT=5001 FEDGRID_MODE=simulation python -m backend.server &
API_PID=$!
sleep 2
if ! kill -0 $API_PID 2>/dev/null; then
  echo "API failed to start."; exit 1
fi

# --- Dashboard (Next.js) ---
export NEXT_PUBLIC_FL_API_URL=http://localhost:5001
if [[ "${1:-}" == "--dev" ]]; then
  echo "Starting dashboard (dev) on http://localhost:3000 ..."
  npm run dev &
else
  echo "Building dashboard..."
  npm run build
  cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
  cp -r public .next/standalone/ 2>/dev/null || true
  echo "Starting dashboard on http://localhost:3000 ..."
  cd .next/standalone && PORT=3000 node server.js &
fi
DASH_PID=$!
cd "$ROOT"
sleep 3

# --- Check ---
echo ""
curl -s -o /dev/null -w "  API:        %{http_code}  http://localhost:5001/health\n" http://localhost:5001/health || true
curl -s -o /dev/null -w "  Dashboard:  %{http_code}  http://localhost:3000\n" http://localhost:3000/ || true
echo ""
echo "Open: http://localhost:3000/dashboard"
echo "API:  http://localhost:5001"
echo ""
echo "Stop: pkill -f backend.server; pkill -f next"
