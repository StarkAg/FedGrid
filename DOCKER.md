# FedGrid — Docker

All services run in Docker; the browser talks to **one origin** (e.g. `http://localhost`). Nginx proxies `/api` to the Flask API, so the dashboard never uses a hardcoded localhost API URL.

## Quick start

```bash
./docker-start.sh
```

Then open **http://localhost** (dashboard at `/`, API at `/api`).

Stop:

```bash
./docker-start.sh --down
```

## Services

| Service    | Image        | Internal port | Role                          |
|-----------|--------------|---------------|-------------------------------|
| **nginx** | nginx:alpine | 80            | Single entrypoint; proxies to dashboard and API |
| **api**   | Dockerfile.api | 5001        | Flask API, simulation, FL     |
| **dashboard** | Dockerfile.dashboard | 3000 | Next.js standalone            |

- Only **port 80** is published. Dashboard and API are not exposed directly.
- The frontend uses **same origin** (`/api`), so no `NEXT_PUBLIC_FL_API_URL` or localhost in the app.

## Build and run manually

```bash
docker compose up --build -d
docker compose logs -f
docker compose down
```

## Data

- API state (FL rounds, prediction, metrics, `num_nodes.txt`, FL logs) is stored in a named volume **`fedgrid_data`** (mounted at `/app/data` in the API container).
- To reset state: `docker compose down -v` (removes volumes).

## Why no localhost in the app

Previously the dashboard was built with a fixed API URL (`http://localhost:5001`). When users opened the **deployed** site, the browser tried to reach `localhost:5001` on the **user’s machine**, causing `ERR_CONNECTION_REFUSED`. Fixes:

1. **Same-origin in code**  
   In the browser, the app uses `window.location.origin + '/api'`, so production uses `https://fedgrid.gradex.bond/api` with no build-time env.

2. **Docker + nginx**  
   One URL (`http://localhost` or your domain). Nginx forwards `/api` to the API container. The frontend only ever calls the same host, so no localhost and no CORS issues.
