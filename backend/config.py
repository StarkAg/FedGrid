"""
FedGrid — Central configuration. No hardcoded values; all parameters here.
Dual-mode: simulation (synthetic data) or hardware (ESP32 data).
"""

import os
from pathlib import Path

# Project root (parent of backend/)
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# --- Mode: "simulation" | "hardware" ---
MODE = os.environ.get("FEDGRID_MODE", "simulation").lower().strip()
if MODE not in ("simulation", "hardware"):
    MODE = "simulation"

# --- Data paths (timestamp, demand or voltage/current/power/kWh) ---
SIMULATION_DATA_DIR = PROJECT_ROOT / "data" / "sample_clients"
HARDWARE_DATA_DIR = PROJECT_ROOT / "data" / "hardware_clients"

# --- LSTM / model ---
SEQ_LEN = int(os.environ.get("FEDGRID_SEQ_LEN", "24"))

# --- Simulation mode ---
NUM_NODES = int(os.environ.get("FEDGRID_NUM_NODES", "3"))
VARIANCE_LEVEL = os.environ.get("FEDGRID_VARIANCE_LEVEL", "medium").lower()
if VARIANCE_LEVEL not in ("low", "medium", "high"):
    VARIANCE_LEVEL = "medium"
BASE_VOLTAGE = float(os.environ.get("FEDGRID_BASE_VOLTAGE", "230"))
BASE_FREQUENCY = float(os.environ.get("FEDGRID_BASE_FREQUENCY", "50"))
# Variance as fraction (e.g. 0.1 = ±10%)
VARIANCE_FRACTION = {"low": 0.05, "medium": 0.15, "high": 0.25}[VARIANCE_LEVEL]
SIMULATION_DAYS = int(os.environ.get("FEDGRID_SIMULATION_DAYS", "7"))

# --- Hardware mode ---
POLLING_INTERVAL_SEC = float(os.environ.get("FEDGRID_POLLING_INTERVAL", "5"))
EXPECTED_NODES = int(os.environ.get("FEDGRID_EXPECTED_NODES", "5"))

# --- Client type hints (simulation only): per-node behavior ---
CLIENT_TYPES = {
    "1": "residential",
    "2": "industrial",
    "3": "high_consumption",
}

# --- Auto FL rerun (0 = disabled) ---
FL_AUTO_RERUN_MINUTES = max(0, int(os.environ.get("FEDGRID_FL_AUTO_RERUN_MINUTES", "0")))
