"""
FedGrid — Flower FL client. Run from project root: python -m client.client --id 1
"""

import argparse
import flwr as fl
from model.lstm_model import build_lstm_model
from backend.metrics import compute_rmse_mae_mape
from client.dataset_loader import load_local_dataset
from client.local_train import train_local_model, get_weights_from_model, set_weights_on_model

INPUT_SHAPE = (24, 1)


def split_train_eval(X, y, eval_ratio: float = 0.2):
    """Chronological split so evaluation uses unseen tail samples."""
    n = len(X)
    if n < 5:
        return X, y, X, y
    split_idx = max(1, min(n - 1, int(n * (1.0 - eval_ratio))))
    return X[:split_idx], y[:split_idx], X[split_idx:], y[split_idx:]


class FedGridClient(fl.client.NumPyClient):
    def __init__(self, client_id: str):
        self.client_id = client_id
        self.model = build_lstm_model(input_shape=INPUT_SHAPE)
        X, y = load_local_dataset(client_id)
        self.X_train, self.y_train, self.X_eval, self.y_eval = split_train_eval(X, y)

    def get_parameters(self, config):
        return get_weights_from_model(self.model)

    def set_parameters(self, parameters):
        set_weights_on_model(self.model, parameters)

    def fit(self, parameters, config):
        self.set_parameters(parameters)
        weights, num_examples = train_local_model(
            self.model, self.X_train, self.y_train, epochs=3, verbose=0
        )
        return get_weights_from_model(self.model), num_examples, {}

    def evaluate(self, parameters, config):
        self.set_parameters(parameters)
        loss, mae = self.model.evaluate(self.X_eval, self.y_eval, verbose=0)
        pred = self.model.predict(self.X_eval, verbose=0)
        _, _, mape = compute_rmse_mae_mape(self.y_eval, pred)
        return float(loss), len(self.X_eval), {"mae": float(mae), "mape": float(mape)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", type=str, default="1", help="Client ID (e.g. 1, 2, 3)")
    parser.add_argument("--server", type=str, default="127.0.0.1:8085", help="FL server address")
    args = parser.parse_args()

    client = FedGridClient(client_id=args.id)
    fl.client.start_client(server_address=args.server, client=client)


if __name__ == "__main__":
    main()
