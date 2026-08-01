"""
FedGrid Configuration
"""
import os
from pathlib import Path

# Project root
ROOT_DIR = Path(__file__).resolve().parent

# Mode: "simulation" or "hardware"
MODE = os.environ.get("FEDGRID_MODE", "simulation")

# Data directories
SIMULATION_DATA_DIR = ROOT_DIR / "data" / "sample_clients"
HARDWARE_DATA_DIR = ROOT_DIR / "data" / "hardware_clients"

# Model parameters
SEQ_LEN = 24  # Number of timesteps to look back for LSTM

# FL Server
FL_SERVER_ADDRESS = "localhost:8085"

# API
API_PORT = int(os.environ.get("FLASK_PORT", "5001"))
