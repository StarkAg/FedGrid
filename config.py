"""
FedGrid — Data source mode and paths.
ML and FL layers are unchanged; only the data source switches.

MODE = "simulation"  → data/sample_clients/client_<id>.csv (or generated synthetic)
MODE = "hardware"    → data/hardware_clients/client_<id>.csv (ESP32 → PC batch upload)
"""

import os
from pathlib import Path

# Project root (parent of config.py)
PROJECT_ROOT = Path(__file__).resolve().parent

# "simulation" | "hardware"
MODE = os.environ.get("FEDGRID_MODE", "simulation").lower().strip()
if MODE not in ("simulation", "hardware"):
    MODE = "simulation"

# Paths for each mode (timestamp, demand CSV per client)
SIMULATION_DATA_DIR = PROJECT_ROOT / "data" / "sample_clients"
HARDWARE_DATA_DIR = PROJECT_ROOT / "data" / "hardware_clients"

# Sequence length for LSTM (hours)
SEQ_LEN = 24

# Optional: client type hints for simulation (residential | industrial | high_consumption)
# Used only in simulation to vary peak shape and scale per client.
CLIENT_TYPES = {
    "1": "residential",
    "2": "industrial",
    "3": "high_consumption",
}
