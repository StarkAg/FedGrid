"""
FedGrid — Simulation data generator. Produces learnable hourly demand per node.
Voltage 230V ± variance%; current per node ± variance; morning (7–9) and evening (6–9) peaks.
Power = V × I; demand = kWh per hour. Saves data/sample_clients/client_<id>.csv.
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

# Project root
_root = Path(__file__).resolve().parents[1]
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from backend.config import (
    NUM_NODES,
    VARIANCE_LEVEL,
    BASE_VOLTAGE,
    VARIANCE_FRACTION,
    SIMULATION_DAYS,
    SIMULATION_DATA_DIR,
)
from backend.config import CLIENT_TYPES


def _hourly_pattern(hour_of_day: np.ndarray) -> np.ndarray:
    """Learnable pattern: morning peak 7–9, evening peak 6–9. Scale 0..1."""
    morning = np.exp(-((hour_of_day - 8) ** 2) / 4)
    evening = np.exp(-((hour_of_day - 19.5) ** 2) / 6)
    base = 0.3 + 0.35 * morning + 0.45 * evening
    return np.clip(base, 0, 1)


def generate_node_series(
    node_id: int,
    num_hours: int,
    variance_fraction: float,
    base_voltage: float,
    client_type: str,
    seed: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Generate voltage (V), current (A), power (W), demand (kWh) per hour.
    Returns (voltage, current, power, demand) each shape (num_hours,).
    """
    rng = np.random.default_rng(seed)
    hours = np.arange(num_hours)
    hour_of_day = hours % 24
    pattern = _hourly_pattern(hour_of_day)

    # Base current (A) by type — different scales for learnable variety
    base_current = {"residential": 2.0, "industrial": 4.0, "high_consumption": 3.0}.get(
        client_type, 2.0
    )
    # Add small trend so it's not perfectly periodic
    trend = 0.02 * np.sin(hours / 24 * 2 * np.pi)
    current = base_current * (pattern + trend) + rng.normal(0, base_current * variance_fraction, num_hours)
    current = np.maximum(0.1, current)

    # Voltage: 230V ± variance%
    voltage = base_voltage * (1 + rng.uniform(-variance_fraction, variance_fraction, num_hours))

    # Power (W) = V * I
    power_w = voltage * current
    # kWh per hour = power (kW) * 1h = power_w / 1000
    demand_kwh = power_w / 1000.0

    return voltage.astype(np.float32), current.astype(np.float32), power_w.astype(np.float32), demand_kwh.astype(np.float32)


def run_simulation(
    num_nodes: int | None = None,
    variance_level: str | None = None,
    num_days: int | None = None,
    out_dir: Path | None = None,
) -> list[Path]:
    """
    Generate at least 7 days of hourly data per node; save one CSV per node.
    Returns list of written file paths.
    """
    num_nodes = num_nodes or NUM_NODES
    variance_level = variance_level or VARIANCE_LEVEL
    variance_fraction = {"low": 0.05, "medium": 0.15, "high": 0.25}.get(variance_level, 0.15)
    num_days = num_days or SIMULATION_DAYS
    num_hours = max(7 * 24, num_days * 24)
    out_dir = out_dir or SIMULATION_DATA_DIR
    out_dir.mkdir(parents=True, exist_ok=True)

    written = []
    start = datetime(2024, 1, 1)
    for i in range(1, num_nodes + 1):
        node_id = i
        client_type = CLIENT_TYPES.get(str(node_id), "residential")
        seed = hash(f"sim_{node_id}_{variance_level}") % (2**31)
        v, c, p, d = generate_node_series(
            node_id, num_hours, variance_fraction, BASE_VOLTAGE, client_type, seed
        )
        timestamps = [start + timedelta(hours=h) for h in range(num_hours)]
        df = pd.DataFrame({
            "timestamp": timestamps,
            "voltage": v,
            "current": c,
            "power_w": p,
            "demand": d,
        })
        path = out_dir / f"client_{node_id}.csv"
        df.to_csv(path, index=False)
        written.append(path)
    return written
