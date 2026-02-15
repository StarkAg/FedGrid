"""
FedGrid — Data source layer (abstraction).
Single contract: (timestamp, demand) → sequences (X, y) for LSTM.
Supports MODE = simulation (CSV or synthetic) and MODE = hardware (CSV from ESP32 batch upload).
"""

import sys
from pathlib import Path

# Ensure project root is on path so config is importable from any cwd
_root = Path(__file__).resolve().parents[1]
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

import numpy as np
import pandas as pd

import config

SEQ_LEN = getattr(config, "SEQ_LEN", 24)


def get_data_path(client_id: str) -> Path:
    """Path to client CSV. Same format for both modes: timestamp, demand."""
    if config.MODE == "hardware":
        data_dir = config.HARDWARE_DATA_DIR
    else:
        data_dir = config.SIMULATION_DATA_DIR
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir / f"client_{client_id}.csv"


def _generate_synthetic(
    hours: int = 744,
    seed: int = None,
    client_type: str = "residential",
) -> np.ndarray:
    """
    Generate hourly demand with morning peak (7–10), evening peak (18–22), noise.
    client_type: residential | industrial | high_consumption
    """
    rng = np.random.default_rng(seed)
    t = np.arange(hours, dtype=np.float32)
    hour_of_day = t % 24

    # Morning peak 7–10, evening peak 18–22
    morning_peak = np.exp(-((hour_of_day - 8.5) ** 2) / 4)
    evening_peak = np.exp(-((hour_of_day - 20) ** 2) / 5)
    base = 1.0 + 0.6 * morning_peak + 0.9 * evening_peak

    if client_type == "industrial":
        base *= 2.0
        base += 0.5 * (hour_of_day >= 8) * (hour_of_day <= 18)
    elif client_type == "high_consumption":
        base *= 1.6
    # residential: base as is

    noise = rng.normal(0, 0.15, hours)
    demand = np.maximum(0.1, base + noise).astype(np.float32)
    return demand


def _load_demand_from_csv(path: Path) -> np.ndarray:
    """Load demand column from CSV (timestamp, demand)."""
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")
    df = pd.read_csv(path)
    if "demand" in df.columns:
        return df["demand"].values.astype(np.float32)
    return df.iloc[:, -1].values.astype(np.float32)


def load_local_dataset(client_id: str, seq_len: int = SEQ_LEN):
    """
    Load data for one client. Source depends on config.MODE.
    Returns (X, y): X (n, seq_len, 1), y (n, 1). Same interface for simulation and hardware.
    """
    path = get_data_path(client_id)

    if config.MODE == "hardware":
        demand = _load_demand_from_csv(path)
    else:
        # Simulation: CSV if present, else synthetic
        if path.exists():
            demand = _load_demand_from_csv(path)
        else:
            client_type = getattr(config, "CLIENT_TYPES", {}).get(
                str(client_id), "residential"
            )
            seed = hash(client_id) % (2**31)
            demand = _generate_synthetic(hours=500, seed=seed, client_type=client_type)

    # Build sequences: same for both modes
    X, y = [], []
    for i in range(len(demand) - seq_len):
        X.append(demand[i : i + seq_len])
        y.append(demand[i + seq_len])
    X = np.array(X, dtype=np.float32).reshape(-1, seq_len, 1)
    y = np.array(y, dtype=np.float32).reshape(-1, 1)
    return X, y


def get_num_samples(client_id: str) -> int:
    """Number of training samples for this client (for FedAvg weighting)."""
    X, _ = load_local_dataset(client_id)
    return len(X)
