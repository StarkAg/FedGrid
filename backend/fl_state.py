"""
FedGrid — Persist FL round history so the dashboard can show live training progress.
"""

import json
from pathlib import Path

from backend.metrics import compute_accuracy_pct

STATE_FILE = Path(__file__).resolve().parent / "fl_state.json"


def read_state():
    """Return { current_round, rounds, prediction? }. prediction includes rmse, mape, accuracy_pct."""
    try:
        if STATE_FILE.exists():
            with open(STATE_FILE) as f:
                data = json.load(f)
            if "prediction" not in data:
                data["prediction"] = _default_prediction()
            return data
    except Exception:
        pass
    return {"current_round": 0, "rounds": [], "prediction": _default_prediction()}


def _default_prediction():
    from datetime import datetime
    return {
        "current_time": datetime.utcnow().isoformat() + "Z",
        "current_total_demand": 0.0,
        "next_hour_prediction": 0.0,
        "rmse": None,
        "mape": None,
        "accuracy_pct": None,
    }


def reset_state():
    """Clear rounds and prediction (call when starting a new FL run)."""
    state = {"current_round": 0, "rounds": [], "prediction": _default_prediction()}
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def write_round(server_round: int, loss: float):
    """Append one round (called from custom strategy)."""
    state = read_state()
    state["rounds"].append({"round": server_round, "loss": round(loss, 6)})
    state["current_round"] = server_round
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def write_prediction(current_total_demand: float, next_hour_prediction: float, rmse: float | None = None, mape: float | None = None):
    """Update prediction for /prediction endpoint."""
    from datetime import datetime
    state = read_state()
    accuracy_pct = compute_accuracy_pct(mape)
    state["prediction"] = {
        "current_time": datetime.utcnow().isoformat() + "Z",
        "current_total_demand": round(current_total_demand, 4),
        "next_hour_prediction": round(next_hour_prediction, 4),
        "rmse": round(rmse, 6) if rmse is not None else None,
        "mape": round(mape, 6) if mape is not None else None,
        "accuracy_pct": round(accuracy_pct, 4) if accuracy_pct is not None else None,
    }
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)
