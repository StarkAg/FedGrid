#!/usr/bin/env bash
# FedGrid — Clean start of all services in Docker.
# Usage: ./docker-start.sh   (build and start in background)
#        ./docker-start.sh --down   (stop and remove containers)
# Requires: Docker and Docker Compose installed.

set -e
cd "$(dirname "$0")"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found. Install Docker from https://docker.com or run local clean start:"
  echo "  ./start-all.sh"
  exit 1
fi

if [[ "${1:-}" == "--down" ]]; then
  docker compose down
  echo "Stopped and removed all FedGrid containers."
  exit 0
fi

echo "Building and starting FedGrid (api, dashboard, nginx)..."
docker compose up --build -d

echo ""
echo "Waiting for services..."
sleep 5
curl -s -o /dev/null -w "  Dashboard (via nginx): %{http_code}\n" http://localhost:80/ || true
curl -s -o /dev/null -w "  API /health (via nginx): %{http_code}\n" http://localhost:80/api/health || true
echo ""
echo "Open: http://localhost"
echo "  (Dashboard and API at /api — no localhost in the app; nginx proxies to containers.)"
