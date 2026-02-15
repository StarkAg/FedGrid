# FedGrid — Project Context

**Federated Learning-Based Smart Grid Demand Forecasting for Privacy-Preserving Energy Optimization**

Use this document as the single source of truth for domain, architecture, ML logic, objectives, and evaluation. Paste or reference it in Cursor so generated code matches the FL smart-grid design.

---

## PROJECT TITLE

Federated Learning-Based Smart Grid Demand Forecasting for Privacy-Preserving Energy Optimization

---

## PROBLEM STATEMENT

Smart grids need accurate electricity demand forecasting to optimize generation, distribution, and cost. Traditional centralized ML requires collecting raw household energy data on a central server, which creates **privacy risks**, **regulatory concerns**, and **security vulnerabilities**.

This project uses a **federated learning** framework: each household (smart meter node) trains a **local** demand forecasting model. Only **model weights** are shared with a central aggregator—**no raw data**. This preserves privacy while maintaining predictive performance.

---

## PROJECT OBJECTIVES

1. Build a smart grid demand forecasting system using **Federated Learning (FL)**.
2. **Preserve user privacy** by keeping raw consumption data on local devices.
3. **Compare** centralized vs federated model performance.
4. **Optimize** energy demand prediction accuracy using deep learning.

---

## SYSTEM ARCHITECTURE

### 1. CLIENT SIDE (Smart Meter Nodes)

- Collect hourly electricity consumption data
- Store data locally
- Train local ML model
- Send **model weights** to central server (not raw data)

### 2. SERVER SIDE (Federated Aggregator)

- Receive weights from clients
- Apply **Federated Averaging (FedAvg)**
- Update global model
- Redistribute updated global model to clients

### 3. CLOUD / DASHBOARD

- Visualize predictions
- Monitor training rounds
- Compare error metrics (RMSE, MAE, MAPE)

---

## TECH STACK

| Layer        | Technology |
|-------------|------------|
| Backend     | Python, Flask/FastAPI, TensorFlow or PyTorch, Flower or PySyft (FL) |
| ML          | LSTM (primary), or GRU / CNN-LSTM hybrid |
| Database    | Local: CSV/SQLite on client; Central: PostgreSQL/Supabase optional |
| Frontend    | React/Next.js dashboard (existing: `app/`), Recharts |
| Deployment  | Docker, VPS/Cloud VM; simulated clients if no real smart meters |

---

## ML MODEL

- **Primary:** LSTM (time-series forecasting).
- **Why LSTM:** Captures temporal dependencies, daily/weekly cycles, seasonal variation.
- **Input:** Past 24–48 hours demand.
- **Output:** Next-hour demand prediction.
- **Loss:** Mean Squared Error (MSE).
- **Metrics:** RMSE, MAE, MAPE.

---

## FEDERATED LEARNING PROCESS

1. Initialize global model
2. Send model to clients
3. Clients train locally (1–5 epochs)
4. Clients send **model weights** (not data)
5. Server performs **Federated Averaging**
6. Updated global model redistributed
7. Repeat for multiple rounds

---

## DATASET OPTIONS (simulation, India context preferred)

- UCI Individual Household Electric Power Consumption Dataset
- Smart meter datasets from Indian utilities (if available)
- **Synthetic data:** morning peak, evening peak, seasonal load variation

---

## INNOVATION FACTOR

- Privacy-preserving ML
- Decentralized learning
- Reduced communication cost
- Scalable smart grid architecture
- Optional: secure aggregation

---

## ADVANCED FEATURES (optional)

- Differential Privacy
- Secure aggregation (encryption)
- Client dropout handling
- Non-IID data handling
- Personalized federated models
- Energy price prediction extension

---

## PROJECT FLOW

```
Data → Local Preprocessing → Local Training → Weight Sharing
  → Federated Averaging → Global Model Update → Prediction → Visualization
```

---

## EXPECTED OUTPUT

- Accurate next-hour demand forecast
- Performance comparable to centralized model
- Privacy preserved (no raw data transmitted)
- Real-time visualization dashboard

---

## PROJECT STRUCTURE (for Cursor / development)

```
backend/
  server.py           # API / health
  federated_server.py  # FL aggregator (FedAvg)
  model.py            # Global model definition
  aggregation.py      # FedAvg logic

client/
  client.py           # FL client (connect to server, train, send weights)
  local_train.py      # Local training loop
  dataset_loader.py   # Load local CSV/SQLite

frontend/
  dashboard/          # → existing Next.js app (app/)

model/
  lstm_model.py       # LSTM architecture (input: 24–48h, output: next hour)

data/
  sample_clients/     # Per-client datasets (CSV or synthetic)
```

Existing FedGrid dashboard lives in **`app/`** (Next.js); backend and clients above are the FL engine that will feed metrics and predictions to it.

---

## How to use this in Cursor

Paste or reference this document (or its path) when asking Cursor to generate or modify code. It will understand:

- Domain: federated learning, smart grid, demand forecasting, privacy.
- Architecture: clients (smart meters) → weights only → aggregator → FedAvg → global model.
- ML: LSTM, 24–48h input, next-hour output, MSE, RMSE/MAE/MAPE.
- Structure: `backend/`, `client/`, `model/`, `data/sample_clients/`, frontend `app/`.

Ask for production-ready FL code (e.g. Flower, TensorFlow/PyTorch LSTM, FedAvg) and it will align with this context.
