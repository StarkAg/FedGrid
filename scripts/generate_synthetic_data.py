#!/usr/bin/env python3
"""
FedGrid — Generate synthetic client CSVs for simulation mode.
Saves data/sample_clients/client_1.csv, client_2.csv, ... (timestamp, demand).
Run from project root: python scripts/generate_synthetic_data.py
"""

import sys
from pathlib import Path

project_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(project_root))

from client.dataset_loader import _generate_synthetic
import pandas as pd

OUT_DIR = project_root / "data" / "sample_clients"
HOURS = 744  # ~31 days
CLIENTS = [
    ("1", "residential"),
    ("2", "industrial"),
    ("3", "high_consumption"),
]


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for client_id, client_type in CLIENTS:
        demand = _generate_synthetic(hours=HOURS, seed=hash(client_id) % (2**31), client_type=client_type)
        df = pd.DataFrame({
            "timestamp": pd.date_range("2024-01-01", periods=len(demand), freq="h"),
            "demand": demand,
        })
        path = OUT_DIR / f"client_{client_id}.csv"
        df.to_csv(path, index=False)
        print(f"Wrote {path} ({len(demand)} rows, {client_type})")
    print("Done. Use MODE=simulation and load_local_dataset(1|2|3).")


if __name__ == "__main__":
    main()
