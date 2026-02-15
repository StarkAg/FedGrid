#!/usr/bin/env bash
# Push code to VPS and optionally restart services. Load credentials from .env.deploy or env.
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
REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/opt/fedgrid}"

SSH_OPTS="-o StrictHostKeyChecking=accept-new"
if [ -n "$DEPLOY_PASSWORD" ] && command -v sshpass &>/dev/null; then
  RUN() { sshpass -p "$DEPLOY_PASSWORD" ssh $SSH_OPTS "$USER@$HOST" "$@"; }
  SCP() { sshpass -p "$DEPLOY_PASSWORD" scp $SSH_OPTS "$@"; }
  export SSHPASS="$DEPLOY_PASSWORD"
else
  RUN() { ssh $SSH_OPTS "$USER@$HOST" "$@"; }
  SCP() { scp $SSH_OPTS "$@"; }
fi

echo "Syncing to $USER@$HOST:$REMOTE_DIR ..."
RUN "mkdir -p $REMOTE_DIR"
if command -v rsync &>/dev/null; then
  RSYNC_RSH="ssh $SSH_OPTS"
  [ -n "$DEPLOY_PASSWORD" ] && command -v sshpass &>/dev/null && export RSYNC_RSH="sshpass -p '$DEPLOY_PASSWORD' ssh $SSH_OPTS"
  rsync -avz --exclude node_modules --exclude venv --exclude .next --exclude .git --exclude __pycache__ --exclude .env.deploy \
    "$PROJECT_DIR/" "$USER@$HOST:$REMOTE_DIR/" || true
fi
RUN "mkdir -p $REMOTE_DIR/backend $REMOTE_DIR/client $REMOTE_DIR/model $REMOTE_DIR/data"
SCP -r "$PROJECT_DIR"/backend "$PROJECT_DIR"/client "$PROJECT_DIR"/model "$PROJECT_DIR"/requirements.txt "$USER@$HOST:$REMOTE_DIR/" 2>/dev/null || true

echo "Remote setup (venv, pip)..."
RUN "cd $REMOTE_DIR && python3.11 -m venv venv 2>/dev/null || python3 -m venv venv 2>/dev/null; ./venv/bin/pip install -r requirements.txt -q"
echo "Deploy done. SSH: ssh $USER@$HOST"
