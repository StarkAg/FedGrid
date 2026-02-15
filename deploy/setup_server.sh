#!/usr/bin/env bash
# One-time VPS setup. Load DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASSWORD from .env.deploy or env.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

if [ -f .env.deploy ]; then
  set -a
  source .env.deploy
  set +a
fi

HOST="${DEPLOY_HOST:-65.20.69.64}"
USER="${DEPLOY_USER:-root}"
# DEPLOY_PASSWORD must be set for sshpass, or use SSH key

echo "Target: $USER@$HOST"

SSH_OPTS="-o StrictHostKeyChecking=accept-new"
if [ -n "$DEPLOY_PASSWORD" ] && command -v sshpass &>/dev/null; then
  RUN() { sshpass -p "$DEPLOY_PASSWORD" ssh $SSH_OPTS "$USER@$HOST" "$@"; }
  SCP() { sshpass -p "$DEPLOY_PASSWORD" scp $SSH_OPTS "$@"; }
else
  RUN() { ssh $SSH_OPTS "$USER@$HOST" "$@"; }
  SCP() { scp $SSH_OPTS "$@"; }
fi
# If no sshpass: you'll be prompted for the password when RUN/SCP are used.

echo "Checking Python on server..."
RUN "which python3.11 || which python3 || true"
RUN "command -v python3.11 || (apt-get update -qq && apt-get install -y -qq python3.11 python3.11-venv python3-pip) 2>/dev/null || true"
RUN "mkdir -p /opt/fedgrid"
echo "Setup done. Next: run deploy/deploy.sh to push code and restart."
echo "Store password in .env.deploy (DEPLOY_PASSWORD=...) so you do not commit it."
