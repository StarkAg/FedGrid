# Run Federated Learning (fast path)

**Python 3.9–3.12 required** (TensorFlow does not support 3.13+ yet). If `python3 --version` is 3.13+, create the venv with e.g. `python3.11 -m venv venv` or `python3.10 -m venv venv`.

## 1. Python env

```bash
cd /path/to/FedGrid
# Use 3.9–3.12 (e.g. on Mac with Homebrew: python3.11 or python3.10)
python3.11 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Start FL server (terminal 1)

```bash
source venv/bin/activate
python -m backend.federated_server
```

Server listens on `0.0.0.0:8085`. Wait until you see "Flower server running".

## 3. Start at least 2 clients (terminals 2 & 3)

```bash
source venv/bin/activate
python -m client.client --id 1 --server 127.0.0.1:8085
```

In another terminal:

```bash
python -m client.client --id 2 --server 127.0.0.1:8085
```

Optional third client: `--id 3`.

## 4. Optional: API server for dashboard (terminal 4)

```bash
python -m backend.server
```

Then open `http://localhost:5000/health` and `http://localhost:5000/api/rounds`.

## Summary

| Terminal | Command |
|----------|--------|
| 1 | `python -m backend.federated_server` |
| 2 | `python -m client.client --id 1` |
| 3 | `python -m client.client --id 2` |
| 4 (optional) | `python -m backend.server` |

Data: synthetic per-client data is generated automatically if `data/sample_clients/client_1.csv` (etc.) don't exist. No external dataset required.
