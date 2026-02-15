# Deploy FedGrid to VPS

**Do not commit passwords.** Use a local env file or environment variables.

## Server

- **Host:** `65.20.69.64`
- **User:** `root`
- **Password:** Set via env (see below).

## 1. Store credentials locally (not committed)

Create a file **`.env.deploy`** in the project root (already in `.gitignore`):

```bash
DEPLOY_HOST=65.20.69.64
DEPLOY_USER=root
DEPLOY_PASSWORD='your_password_here'
```

Or export before running scripts:

```bash
export DEPLOY_HOST=65.20.69.64
export DEPLOY_USER=root
export DEPLOY_PASSWORD='s=6Gt,)[}*Jz%tM9'
```

## 2. One-time server setup (Python, Node, project)

From your Mac, with credentials in env:

```bash
source .env.deploy 2>/dev/null || true
./deploy/setup_server.sh
```

This installs Python 3.11, Node (if needed), and clones/sets up the project on the server.

## 3. Deploy app (push code and restart services)

```bash
./deploy/deploy.sh
```

## 4. Dashboard (public URL)

After deploy, the Next.js dashboard runs on the VPS. Start it with:

```bash
# On server (or use deploy script to start it):
cd /opt/fedgrid && nohup npm start > /opt/fedgrid/dashboard.log 2>&1 &
# Open firewall if needed: ufw allow 3000/tcp && ufw reload
```

**URL:** http://65.20.69.64:3000 — login, then view the 3-meter dashboard (mock data).

## 5. Run FL on the server

**One-command start (recommended):**

```bash
ssh root@65.20.69.64
cd /opt/fedgrid
./scripts/start_all.sh start
# Starts: FL server (8085), 2 clients, Flask API (5000). Dashboard already running on 3000.
./scripts/start_all.sh stop   # to stop
```

**Or manually:** run `python -m backend.federated_server`, then in two more terminals `python -m client.client --id 1` and `--id 2`, then `python -m backend.server` for the API.

**Dashboard ↔ FL:** The dashboard shows "Federated training rounds" from `GET /api/rounds`. On the VPS, set `NEXT_PUBLIC_FL_API_URL=http://65.20.69.64:5000` before `npm run build` so the built app calls the API correctly.
