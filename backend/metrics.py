"""
FedGrid — RMSE, MAE, MAPE computation and historical storage for dashboard.
Updated every federated round; history used for RMSE vs Rounds graph.
"""

import json
import math
from pathlib import Path

METRICS_FILE = Path(__file__).resolve().parent / "metrics_state.json"


def compute_accuracy_pct(mape: float | None):
    """Translate forecast percentage error into a bounded accuracy-style value."""
    if mape is None:
        return None
    return float(max(0.0, min(100.0, 100.0 - mape)))


def compute_rmse_mae_mape(y_true, y_pred):
    """Compute RMSE, MAE, MAPE from 1d arrays. MAPE avoids div-by-zero."""
    import numpy as np
    y_true = np.asarray(y_true).ravel()
    y_pred = np.asarray(y_pred).ravel()
    n = len(y_true)
    if n == 0:
        return 0.0, 0.0, 0.0
    mse = np.mean((y_true - y_pred) ** 2)
    rmse = math.sqrt(mse)
    mae = np.mean(np.abs(y_true - y_pred))
    # MAPE: only where y_true != 0
    mask = np.abs(y_true) > 1e-9
    if mask.sum() == 0:
        mape = 0.0
    else:
        mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100.0
    return float(rmse), float(mae), float(mape)


def read_metrics():
    """Return { history: [{ round, rmse, mae, mape, accuracy_pct }], latest: {...} }."""
    try:
        if METRICS_FILE.exists():
            with open(METRICS_FILE) as f:
                return json.load(f)
    except Exception:
        pass
    return {"history": [], "latest": {"rmse": None, "mae": None, "mape": None, "accuracy_pct": None}}


def reset_metrics():
    """Clear history (e.g. at start of new FL run)."""
    state = {"history": [], "latest": {"rmse": None, "mae": None, "mape": None, "accuracy_pct": None}}
    METRICS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_FILE, "w") as f:
        json.dump(state, f, indent=2)


def write_round_metrics(server_round: int, rmse: float, mae: float | None, mape: float | None):
    """Append one round's metrics and set latest."""
    accuracy_pct = compute_accuracy_pct(mape)
    state = read_metrics()
    state["history"].append({
        "round": server_round,
        "rmse": round(rmse, 6),
        "mae": round(mae, 6) if mae is not None else None,
        "mape": round(mape, 6) if mape is not None else None,
        "accuracy_pct": round(accuracy_pct, 4) if accuracy_pct is not None else None,
    })
    state["latest"] = {"rmse": rmse, "mae": mae, "mape": mape, "accuracy_pct": accuracy_pct}
    METRICS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_FILE, "w") as f:
        json.dump(state, f, indent=2)
