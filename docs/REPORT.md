# FedGrid — Report / slides outline

Use this structure for your project report or viva slides.

---

## 1. Title

**Federated Learning-Based Smart Grid Demand Forecasting for Privacy-Preserving Energy Optimization**

---

## 2. Problem statement

- Smart grids need accurate demand forecasting.
- Centralized ML requires moving raw household data to a server → **privacy and regulatory risks**.
- We use **federated learning**: each node trains locally; only **model weights** are shared.

---

## 3. Objectives

1. Build a demand forecasting system using **Federated Learning (FL)**.
2. **Preserve privacy**: raw consumption stays on local devices.
3. **Compare** centralized vs federated performance (RMSE/MAE).
4. Improve prediction accuracy with an **LSTM** model.

---

## 4. System architecture

- **Layer 1 — Data:** Simulation (synthetic CSV) or hardware (ESP32 → CSV batch).
- **Layer 2 — Clients:** Load data, train LSTM locally, send weights to server.
- **Layer 3 — Server:** Federated Averaging (FedAvg), global model update.
- **Layer 4 — Dashboard:** Live meters + FL training rounds (loss per round).

**Single data contract:** `timestamp`, `demand` — same for simulation and hardware.

---

## 5. ML model

- **LSTM** (Keras): past 24 hours → next-hour demand.
- **Loss:** MSE. **Metrics:** RMSE, MAE (optionally MAPE).

---

## 6. Federated learning process

1. Server initializes global model.
2. Clients receive global model, train locally (1–5 epochs).
3. Clients send **weights only** (no raw data).
4. Server runs **FedAvg**, updates global model.
5. Repeat for N rounds.

---

## 7. Results (fill with your numbers)

- **Centralized:** Train one LSTM on all clients’ data → Test RMSE = ___, MAE = ___.
- **Federated:** 5 rounds, 2 clients → Final round loss (MSE) = ___, RMSE ≈ ___.
- **Conclusion:** Federated achieves comparable performance while preserving privacy.

*(Run `python scripts/compare_centralized_federated.py` and paste the summary table.)*

---

## 8. Innovation / contributions

- Privacy-preserving ML (no raw data leaves the node).
- **Dual-mode design:** simulation and real hardware share the same pipeline.
- Modular data layer: swap data source without changing FL or model.

---

## 9. Demo

- **Dashboard:** http://65.20.69.64:3000 (login → 3-meter view + FL rounds table).
- **FL:** Server + 2 clients run on VPS; rounds and loss visible in the dashboard.

---

## 10. Future work (optional)

- Differential privacy; secure aggregation; more clients; real ESP32 deployment with batch upload.
