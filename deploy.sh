#!/usr/bin/env bash
# FedGrid — One-command deploy to fedgrid.gradex.bond (65.20.84.46)
set -e
VPS="65.20.84.46"
DOMAIN="fedgrid.gradex.bond"
DASHBOARD_PORT=3100
API_PORT=5100

echo "=== Deploying FedGrid to $DOMAIN ($VPS) ==="
echo "Using ports: Dashboard=$DASHBOARD_PORT, API=$API_PORT"

# Sync code
rsync -avz --delete \
  --exclude 'venv' --exclude 'node_modules' --exclude '.next' \
  --exclude '.git' --exclude '*.log' --exclude '*.pid' --exclude '__pycache__' \
  "$(dirname "$0")/" root@$VPS:/opt/fedgrid/

# Build and start on VPS
ssh root@$VPS "cd /opt/fedgrid && \
  export NEXT_PUBLIC_FL_API_URL=https://$DOMAIN/api && \
  npm install && npm run build && \
  cp -r .next/static .next/standalone/.next/ && \
  cp -r public .next/standalone/ && \
  python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && \
  pkill -f 'fedgrid.*backend.server' || true && \
  pkill -f 'next-server' || true && \
  cd /opt/fedgrid && FLASK_PORT=$API_PORT nohup python -m backend.server > api.log 2>&1 & \
  cd /opt/fedgrid/.next/standalone && PORT=$DASHBOARD_PORT nohup node server.js > /opt/fedgrid/dashboard.log 2>&1 & \
  sleep 3 && \
  curl -s http://localhost:$API_PORT/health && \
  curl -s http://localhost:$DASHBOARD_PORT | head -5"

echo ""
echo "✓ Deployed to https://$DOMAIN"
echo "  Dashboard: https://$DOMAIN"
echo "  API: https://$DOMAIN/api/health"
