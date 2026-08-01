# FedGrid — Model Explanation (for Panel / Defense)

## 1. What model we use

We use a **recurrent neural network (LSTM)** for **next-hour demand forecasting** in a federated setting.

- **Framework:** TensorFlow/Keras, same architecture on the central server and on every client.
- **Task:** Time-series regression: given the **last 24 hours of hourly demand**, predict the **demand for the next hour** (in kWh).

---

## 2. Model architecture

- **Input shape:** `(24, 1)` — 24 time steps, 1 feature (hourly demand in kWh).
- **Layers:**
  1. **LSTM(64)** — 64 units, processes the 24-step sequence.
  2. **Dropout(0.2)** — regularization.
  3. **Dense(1)** — single output: predicted demand for the next hour.
- **Training:** Adam optimizer, **MSE** loss, **MAE** as metric.
- **Output:** One scalar per sample = **next-hour demand (kWh)** for that “node” or client.

So: **past 24 hours → LSTM → next 1 hour**. No other inputs (no calendar, no weather); the model relies on the recent demand curve (e.g. peaks, daily pattern).

---

## 3. Data

- **Per client:** One dataset per “smart meter” or client (e.g. `client_1.csv`, `client_2.csv`, `client_3.csv`).
- **Format:** Hourly demand (kWh). Each row = one hour; we form **sliding windows** of length 24 to predict the next hour.
- **Sequence construction:** For each `i`, `X[i] = demand[i : i+24]`, `y[i] = demand[i+24]`. So **X** has shape `(n, 24, 1)` and **y** has shape `(n, 1)`.
- **Modes:** Simulation (synthetic or CSV from “Start Simulation”) or hardware (CSV from ESP32 / real meters). Same (X, y) contract in both.

---

## 4. Federated learning (FedAvg)

- **Server:** Holds the **global LSTM model** (same architecture). Runs **Flower** FL server; aggregation = **FedAvg** (weighted average of client updates by number of local examples).
- **Clients:** Three clients by default. Each has the **same LSTM architecture**, loads its **local dataset** (one client ID), trains for **3 epochs** with the current global weights, then sends **model weights** (not raw data) to the server.
- **Rounds:** 20 rounds per FL run. Each round: server sends global weights → clients train locally → clients send updated weights → server aggregates (FedAvg) → server evaluates and updates **dashboard state** (round, loss, prediction).
- **Privacy:** Only **model parameters** are exchanged; **no raw demand data** leaves the clients.

---

## 5. How we get “next hour prediction” on the dashboard

- After each round, the **server-side strategy** (FedAvgWithLogging):
  1. Takes the **aggregated global weights**.
  2. Builds the same LSTM, sets these weights.
  3. Loads **one client’s recent data** (e.g. client 1), takes the **last 24-hour window**.
  4. Runs **one forward pass** → one scalar = **next-hour demand per node** (kWh).
  5. Reads **number of nodes** (from “Start Simulation”, stored in `data/num_nodes.txt`).
  6. **Scales:** `next_hour_total = pred_per_node × num_nodes`.
  7. Writes this **next_hour_total** (and optional RMSE/MAPE) to **FL state**; the dashboard reads it and shows **“Next hour prediction”** in kWh.

So the **model output is per-node**; we multiply by the **actual number of nodes** to get the **total next-hour prediction** shown on the panel.

---

## 6. One-sentence summary for the panel

**“We use a small LSTM that takes the last 24 hours of hourly demand and predicts the next hour’s demand in kWh; it is trained in a federated way with FedAvg so that each client (e.g. smart meter) only shares model weights, not raw data, and the server aggregates them and exposes a single next-hour prediction (scaled to total demand) on the dashboard.”**

---

## 7. Key numbers (for slides / talking points)

| Item              | Value |
|-------------------|--------|
| Input length      | 24 hours |
| Output            | 1 value (next hour, kWh) |
| LSTM units        | 64 |
| Dropout           | 0.2 |
| Local epochs      | 3 per round |
| FL rounds         | 20 |
| Clients           | 3 (configurable) |
| Loss              | MSE |
| Metric            | MAE (and RMSE = √MSE) |
