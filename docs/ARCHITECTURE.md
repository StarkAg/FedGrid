# FedGrid System Architecture

## Overview

FedGrid is a federated learning system for smart grid demand forecasting. Data stays at the edge; only model weights are exchanged with a central FL server. A dashboard and REST API orchestrate simulation, FL runs, and live metrics.

## High-Level Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD (Next.js)                                            │
│  • Live nodes, metrics, rounds, prediction                      │
│  • Start simulation, Rerun FL                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP /api
┌───────────────────────────────▼─────────────────────────────────┐
│  API (Flask)                                                    │
│  • /mode, /nodes, /metrics, /prediction, /api/rounds            │
│  • POST /api/simulation/start, POST /api/fl/rerun                │
│  • Reads FL state; starts FL server + 3 clients                 │
└───────┬─────────────────────────────────────────┬───────────────┘
        │                                           │
        │ in-memory                                  │ subprocess
        ▼                                           ▼
┌───────────────────┐                     ┌─────────────────────────┐
│  DATA LAYER      │                     │  FL SERVER (Flower)     │
│  • Simulation:   │                     │  • FedAvg, 20 rounds     │
│    - CSV per     │  client_1..3.csv    │  • Aggregates weights   │
│      client      │◄───────────────────│  • Writes rounds,       │
│  • Live nodes:   │                     │    prediction to state   │
│    Simulation    │                     └────────────┬────────────┘
│    Service       │                                  │ gRPC
│    (in-memory)   │                     ┌────────────▼────────────┐
└──────────────────┘                     │  FL CLIENTS (×3)         │
                                         │  • Load client_N.csv    │
                                         │  • LSTM local training  │
                                         │  • Send weights to      │
                                         │    server               │
                                         └────────────────────────┘
```

## Components

| Layer | Component | Role |
|-------|-----------|------|
| **Dashboard** | Next.js (port 3000 / behind nginx) | UI: nodes, charts, rounds, prediction; calls API (same origin `/api`). |
| **API** | Flask (port 5001) | REST: mode, nodes, metrics, prediction, rounds; starts simulation and FL; serves from FL state + simulation service. |
| **Data** | Simulation service + CSV files | **Live:** in-memory smart meter nodes (1–500). **Training:** `data/sample_clients/client_{1,2,3}.csv` (timestamp, demand) from simulation/data generator. |
| **FL Server** | Flower, `backend.federated_server` | Listens on 8085; FedAvg; 20 rounds; strategy writes rounds and next-hour prediction to state. |
| **FL Clients** | Flower, `client.client` (×3) | Load `client_{1,2,3}.csv`, train LSTM locally, exchange weights with server. |

## Data Flow

1. **Simulation start (dashboard → API):** User clicks “Start Simulation” → API calls `simulation.data_generator.run_simulation(num_nodes)` → CSVs written; simulation service `resize_nodes()`; `num_nodes.txt` written for prediction scaling.
2. **Live view:** Dashboard polls `/nodes`, `/metrics`, `/prediction` → API reads simulation service (live nodes) and FL state (prediction, rounds).
3. **FL run:** User clicks “Rerun FL” → API starts `backend.federated_server` and 3× `client.client` → clients load CSVs, train, send weights; server aggregates and writes state.
4. **Prediction:** Strategy’s `evaluate` uses aggregated model + `num_nodes.txt` to compute next-hour total demand and writes it to FL state; API serves it at `/prediction`.

## Files / State (No DB)

- **FL state:** `backend/fl_state.json` (rounds, prediction).
- **Metrics:** `backend/metrics.json` (round-level metrics).
- **Node count:** `data/num_nodes.txt` (for scaling prediction).
- **Training data:** `data/sample_clients/client_1.csv`, `client_2.csv`, `client_3.csv`.
- **Live nodes:** In-memory in `SimulationService`.
