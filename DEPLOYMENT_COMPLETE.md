# FedGrid Deployment Complete ✅

## No database required

- **Simulation data**: In-memory only (live nodes + CSV files under `data/sample_clients/`).
- **FL state / predictions**: JSON files in `backend/` (e.g. `fl_state.json`), no DB.
- **Node count**: Set via "Start Simulation" (1–500 nodes); live dashboard updates immediately.

## Services Running on VPS (65.20.84.46)

All services are now running on **separate ports** to avoid conflicts:

- **Flask API**: Port 5100 ✅
- **Next.js Dashboard**: Port 3100 ✅
- **Nginx Reverse Proxy**: Port 8443 (HTTPS) ✅

## Access Your Dashboard

**URL**: `https://fedgrid.gradex.bond:8443`

### Final Steps (2 minutes):

1. **Configure Cloudflare DNS** (if not already done):
   - Go to Cloudflare Dashboard → DNS
   - Add/Update A record: `fedgrid` → `65.20.84.46`
   - Make sure proxy is enabled (orange cloud icon)

2. **Change Cloudflare SSL Mode**:
   - Go to Cloudflare Dashboard → SSL/TLS → Overview
   - Change from **"Full (strict)"** to **"Full"**
   - Wait 1-2 minutes for propagation

3. **Access Dashboard**:
   - Open: `https://fedgrid.gradex.bond:8443`
   - Dashboard: `https://fedgrid.gradex.bond:8443/dashboard`
   - API Health: `https://fedgrid.gradex.bond:8443/api/health`

## What's Running

```
┌─────────────────────┐
│   Cloudflare CDN    │  (SSL/TLS: Full mode)
└──────────┬──────────┘
           │ HTTPS
           ↓
┌─────────────────────┐
│  VPS: 65.20.84.46   │
│  Port 8443 (Nginx)  │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ↓             ↓
┌────────┐   ┌────────┐
│ API    │   │Dashboard│
│ :5100  │   │ :3100   │
└────────┘   └─────────┘
```

## Ports Used

- **8443**: Nginx HTTPS (public, firewall open)
- **3100**: Next.js Dashboard (internal only)
- **5100**: Flask API (internal only)

**Note**: Ports 80, 443, 3000, 5001 are left untouched for your other services.

## Deploy Script

To update FedGrid in the future:

```bash
./deploy.sh
```

This will:
- Sync code to VPS
- Build Next.js
- Install Python dependencies
- Restart services on ports 3100 & 5100

## Troubleshooting

### Check if services are running:
```bash
ssh root@65.20.84.46 "ss -tlnp | grep -E ':3100|:5100|:8443'"
```

### View logs:
```bash
ssh root@65.20.84.46 "cd /opt/fedgrid && tail -50 api.log"
ssh root@65.20.84.46 "cd /opt/fedgrid && tail -50 dashboard.log"
```

### Restart services:
```bash
ssh root@65.20.84.46 "pkill -f 'fedgrid.*backend.server' && pkill -f 'fedgrid.*server.js'"
./deploy.sh
```

## Why the app was using localhost

The dashboard was originally built with a **fixed API URL** (`http://localhost:5001`) for local development. When that same build was deployed to **fedgrid.gradex.bond**, the browser still tried to call `localhost:5001` on the **user’s machine**, which caused `ERR_CONNECTION_REFUSED`. The fix in code was to use **same origin** in the browser (`window.location.origin + '/api'`) so the deployed site calls `https://fedgrid.gradex.bond/api` with no build-time env. With **Docker**, the frontend never talks to localhost: everything goes through **one URL** (e.g. `http://localhost`) and **nginx** proxies `/api` to the API container, so the app only sees one origin.

## Docker — all services in one place, clean start

You can run the whole stack in Docker so there’s no localhost in the app and one command starts everything:

```bash
./docker-start.sh
```

This will:

- Build and start **api** (Flask), **dashboard** (Next.js), and **nginx**
- Expose a single entrypoint: **http://localhost** (port 80)
- Proxy `/` → dashboard, `/api` → API (browser uses same origin, no localhost)

**Stop everything:**

```bash
./docker-start.sh --down
```

**Manual control:**

```bash
docker compose up --build -d    # start
docker compose down             # stop
docker compose logs -f          # follow logs
```

See **`DOCKER.md`** for details (Dockerfiles, nginx, volumes).

## Files Created

- `deploy.sh` - One-command deployment script (VPS)
- `docker-start.sh` - Clean start/stop for Docker stack
- `docker-compose.yml` - API, dashboard, nginx
- `Dockerfile.api` / `Dockerfile.dashboard` - Container builds
- `nginx.conf` - Single entrypoint routing
- `setup_ssl.sh` - SSL/Nginx configuration script
- `CLOUDFLARE_SSL_SETUP.md` - Detailed SSL setup guide
- `DEPLOYMENT_COMPLETE.md` - This file

---

**Your FedGrid system is now live!** 🎉
