# FedGrid Backend (FL Aggregator + API)

Federated Learning server: receives client weights, runs **Federated Averaging**, redistributes global model.

## Structure

| File | Purpose |
|------|--------|
| `server.py` | Flask/FastAPI API (health, optional metrics for dashboard) |
| `federated_server.py` | FL aggregator (FedAvg, round logic); can use Flower |
| `model.py` | Global model definition (shared with clients) |
| `aggregation.py` | FedAvg implementation |

## Run

- **API:** `python server.py` (after implementing)
- **FL server:** Use Flower or implement `federated_server.start_aggregator_server()`

## Dashboard

The Next.js dashboard lives in **`../app/`**. Once backend exposes metrics/rounds, point the dashboard at this API for training round and prediction visualizations.

See **`../PROJECT_CONTEXT.md`** for full architecture and objectives.
