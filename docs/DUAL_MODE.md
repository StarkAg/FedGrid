# FedGrid — Dual-mode data architecture

The ML and federated layers do **not** depend on where data comes from. They only expect **timestamp, demand**. Two data sources feed the same pipeline.

---

## Core idea

- **Single contract:** every data source produces (or is stored as) `timestamp`, `demand`.
- **Simulation mode:** synthetic or pre-generated CSV in `data/sample_clients/`.
- **Hardware mode:** ESP32 → PC batch upload → CSV in `data/hardware_clients/`.
- **Same LSTM, same FedAvg, same dashboard.** Only the data source layer switches.

---

## System layers

| Layer | Role |
|-------|------|
| **1. Data source** | Simulation generator **or** ESP32 hardware nodes (batch CSV). |
| **2. Local client** | Loads data (CSV from either dir), builds sequences, trains LSTM, sends weights. |
| **3. Federated server** | Aggregates weights, updates global model. |
| **4. Dashboard** | Shows metrics and predictions. |

---

## Mode 1 — Simulation

- **Use:** development, debugging, report screenshots, controlled experiments. No hardware.
- **Data:** `data/sample_clients/client_1.csv`, `client_2.csv`, … or in-memory synthetic if file missing.
- **Synthetic:** morning peak (7–10), evening peak (18–22), noise; optional client types: `residential`, `industrial`, `high_consumption`.
- **Set:** `MODE = "simulation"` in `config.py` or `export FEDGRID_MODE=simulation`.

Generate CSVs (optional):

```bash
python scripts/generate_synthetic_data.py
```

---

## Mode 2 — Hardware

- **Use:** real smart meters (ESP32 + ACS712 + ZMPT101B) feeding a PC that runs the federated client.
- **Data:** `data/hardware_clients/client_1.csv`, … same format: `timestamp`, `demand`.
- **Flow:** ESP32 measures V × I → sends to PC (HTTP/MQTT) → PC appends to CSV every 5–15 min (batch). Training runs on PC, not on ESP32.
- **Set:** `MODE = "hardware"` in `config.py` or `export FEDGRID_MODE=hardware`.

See `data/hardware_clients/README.md` for CSV format and setup.

---

## How to switch

**config.py:**

```python
MODE = "simulation"   # or "hardware"
```

**Or environment:**

```bash
export FEDGRID_MODE=hardware
python -m client.client --id 1
```

**In code:** `client/dataset_loader.py` uses `config.MODE` to choose the directory and whether to fall back to synthetic. Same `load_local_dataset(client_id)` → same `(X, y)` for training.

---

## Hardware setup (minimum for 2 nodes)

- 2 × ESP32, 2 × ACS712, 2 × ZMPT101B, 2 × small AC loads.
- Server: laptop or VPS (Flower).
- PC at each site (or one PC with two CSVs) runs `client.client` and reads `data/hardware_clients/client_<id>.csv`.

---

## Dashboard: live vs batch

- **Batch (recommended):** PC writes CSV every 5–15 min; client trains on latest file. Simple and robust.
- **Live streaming:** would require a separate real-time path (e.g. WebSocket/API) for the dashboard; ML training can still use batch CSV. Not required for the dual-mode data contract.

---

## Viva-style answer

*“We designed the data ingestion layer to be modular. The ML and federated layers are independent of the data source. The system supports synthetic simulation for testing and real smart-meter hardware for deployment, both through the same (timestamp, demand) interface.”*
