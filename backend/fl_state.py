"""
FedGrid — Persist FL round history so the dashboard can show live training progress.
"""

import json
from pathlib import Path

STATE_FILE = Path(__file__).resolve().parent / "fl_state.json"


def read_state():
    """Return { current_round, rounds: [{ round, loss }, ...] }."""
    try:
        if STATE_FILE.exists():
            with open(STATE_FILE) as f:
                return json.load(f)
    except Exception:
        pass
    return {"current_round": 0, "rounds": []}


def write_round(server_round: int, loss: float):
    """Append one round (called from custom strategy)."""
    state = read_state()
    state["rounds"].append({"round": server_round, "loss": round(loss, 6)})
    state["current_round"] = server_round
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)
