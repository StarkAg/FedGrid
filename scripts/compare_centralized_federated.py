#!/usr/bin/env python3
"""
FedGrid — Compare centralized vs federated LSTM (same data, same test set).
Run from project root: python scripts/compare_centralized_federated.py
Output: RMSE/MAE for both and a short summary table.
"""

import sys
from pathlib import Path
import numpy as np

project_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(project_root))

from model.lstm_model import build_lstm_model
from client.dataset_loader import load_local_dataset

SEQ_LEN = 24


def load_all_client_data():
    """Concatenate client 1,2,3 data for centralized training."""
    X_list, y_list = [], []
    for cid in ("1", "2", "3"):
        X, y = load_local_dataset(cid)
        X_list.append(X)
        y_list.append(y)
    X = np.concatenate(X_list, axis=0)
    y = np.concatenate(y_list, axis=0)
    return X, y


def train_centralized(X_train, y_train, epochs=5):
    """Train one LSTM on all data (centralized)."""
    model = build_lstm_model(input_shape=(SEQ_LEN, 1))
    model.fit(X_train, y_train, epochs=epochs, verbose=0, batch_size=32)
    return model


def evaluate_metrics(model, X, y):
    """Return MSE, RMSE, MAE."""
    pred = model.predict(X, verbose=0)
    mse = float(np.mean((pred - y) ** 2))
    rmse = np.sqrt(mse)
    mae = float(np.mean(np.abs(pred - y)))
    return mse, rmse, mae


def main():
    print("Loading data (all clients)...")
    X, y = load_all_client_data()
    n = len(X)
    split = int(0.8 * n)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    print(f"  Train: {len(X_train)}, Test: {len(X_test)}")

    print("\n1. Centralized: training one model on all data...")
    cen_model = train_centralized(X_train, y_train, epochs=5)
    cen_mse, cen_rmse, cen_mae = evaluate_metrics(cen_model, X_test, y_test)
    print(f"   Test MSE={cen_mse:.4f}, RMSE={cen_rmse:.4f}, MAE={cen_mae:.4f}")

    print("\n2. Federated: use last saved fl_state.json loss as proxy for final round loss.")
    print("   (Run FL separately; this script only compares with centralized.)")
    fl_state_path = project_root / "backend" / "fl_state.json"
    if fl_state_path.exists():
        import json
        with open(fl_state_path) as f:
            state = json.load(f)
        rounds = state.get("rounds", [])
        if rounds:
            last_loss = rounds[-1]["loss"]
            # Approximate RMSE from MSE (FL server stores MSE)
            fl_rmse = np.sqrt(last_loss)
            print(f"   Last round loss (MSE): {last_loss:.4f} → RMSE ≈ {fl_rmse:.4f}")
        else:
            last_loss = fl_rmse = None
    else:
        last_loss = fl_rmse = None
        print("   No fl_state.json found. Run FL server + clients first.")

    print("\n--- Summary ---")
    print("                Centralized    Federated (last round)")
    print(f"  RMSE           {cen_rmse:.4f}         {fl_rmse:.4f}" if fl_rmse is not None else f"  RMSE           {cen_rmse:.4f}         (run FL first)")
    print(f"  MAE            {cen_mae:.4f}         (evaluate global model for exact MAE)")
    print("\nFederated preserves privacy (no raw data shared); compare metrics for report.")


if __name__ == "__main__":
    main()
