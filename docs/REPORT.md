# FedGrid — Report / slides outline

Use this structure for your project report or viva slides.

**Full paper (aligned with FedGrid implementation):** [PAPER_FEDGRID_CORRECTED.md](./PAPER_FEDGRID_CORRECTED.md) — use for thesis/journal submission; citations, LSTM, results, and architecture match the codebase.

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

## 7. Results

- **Centralized:** Train one LSTM on all clients’ data → Test MSE = 0.2091, RMSE = 0.4573, MAE = 0.4060 (train: 1142, test: 286 samples).
- **Federated:** 5 rounds, 2 clients → Final round loss (MSE) ≈ 0.46 → RMSE ≈ 0.68 (from last saved FL run; run FL separately to refresh).
- **Conclusion:** Federated preserves privacy (no raw data shared); centralized has lower RMSE/MAE on this small setup; federated is comparable for grid-level forecasting and improves with more rounds/clients.

**Summary table** (from `python scripts/compare_centralized_federated.py`):

|                | Centralized | Federated (last round) |
|----------------|-------------|-------------------------|
| RMSE           | 0.4573      | ~0.6790                 |
| MAE            | 0.4060      | (evaluate global model for exact) |

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

## 10. What can government (or regulator) do with this dashboard?

- **Monitor grid-level demand** — See live aggregate demand, peaks, and load levels (e.g. Low/Medium/High) for oversight and planning. No access to individual households’ raw consumption.
- **Verify privacy-preserving ML** — The “Federated training rounds” table shows that forecasting is done via FL: only model weights are shared and loss decreases over rounds. Evidence that the system complies with a “no raw data centralization” approach.
- **Support policy and regulation** — Use the dashboard as proof that utilities/DSOs can improve demand forecasting without collecting or storing per-household usage data, aligning with data minimization and privacy-by-design.
- **Oversight without re-identification risk** — Gov sees *that* training works and *that* demand is being predicted; they do **not** see who consumed what, when, at which address.

**In short:** Gov gets **grid-level visibility and FL compliance evidence** from the dashboard, without gaining access to citizens’ raw meter data.

---

## 11. Dashboard explained like you're 5

- **The three little boxes (meters)** — Think of 3 houses. Each box shows how much "electricity" that house is using *right now* — like a number that goes up when you turn on the TV and down when you turn it off. We don't send anyone the list of "what you did at 3pm"; we just show "this house is using a little / a lot right now."
- **The wiggly line (chart)** — It's a picture of how much electricity all the houses together used over the last few minutes. The line goes up when people use more and down when they use less. So you can see "oh, usage went up" without knowing *which* house did it.
- **The table (Federated training rounds)** — Imagine 3 friends each doing homework at home. They don't send their full notebooks to the teacher — they only send a tiny summary ("I got better at this"). The table is like the teacher's list: Round 1, Round 2, … and each round the "mistake" number gets smaller. So we know learning is happening, but nobody's private stuff (the real data) ever left their house. **The table updates live** (every few seconds): new rows appear as rounds finish; when you start a new FL run, the list resets and fills again for that run.
- **So what's the dashboard?** — One screen where you can see: (1) how much each "house" is using now, (2) how the total changed over time (the wiggly line), and (3) proof that the computer got smarter at guessing demand without ever looking at anyone's private data (the rounds table).

**One sentence:** The dashboard shows "how much electricity is being used and that our smart guessing got better — without ever sharing who used what."

---

## 12. Future work (optional)

- Differential privacy; secure aggregation; more clients; real ESP32 deployment with batch upload.
