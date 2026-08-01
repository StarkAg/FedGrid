"""
FedGrid — FedAvg strategy that writes round/loss, metrics, and prediction to state for dashboard.
"""

import math
import numpy as np
from flwr.server.strategy import FedAvg
from flwr.server.client_proxy import ClientProxy
from flwr.common import Scalar, EvaluateRes, parameters_to_ndarrays

from backend.fl_state import write_round, write_prediction
from backend.metrics import write_round_metrics


class FedAvgWithLogging(FedAvg):
    """FedAvg that persists each round's loss, metrics, and prediction for dashboard."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._global_params = None

    def aggregate_fit(self, server_round, results, failures):
        params_agg, metrics_agg = super().aggregate_fit(server_round, results, failures)
        if params_agg is not None:
            self._global_params = params_agg
            # Update prediction as soon as we have new weights (don't rely only on evaluate)
            self._update_prediction(rmse=None, mape=None)
        return params_agg, metrics_agg

    def aggregate_evaluate(
        self,
        server_round: int,
        results,
        failures,
    ):
        loss_aggregated, metrics_aggregated = super().aggregate_evaluate(
            server_round, results, failures
        )
        if loss_aggregated is not None:
            write_round(server_round, loss_aggregated)
            rmse = math.sqrt(loss_aggregated)
            mae, mape = self._aggregate_eval_metrics(results)
            write_round_metrics(server_round, rmse, mae, mape)
            # Update prediction using global model
            self._update_prediction(rmse, mape)
        return loss_aggregated, metrics_aggregated

    def _aggregate_eval_metrics(self, results):
        """Aggregate custom evaluation metrics by client sample count."""
        mae_weighted_sum = 0.0
        mae_examples = 0
        mape_weighted_sum = 0.0
        mape_examples = 0

        for _, evaluate_res in results:
            num_examples = int(evaluate_res.num_examples)
            metrics = evaluate_res.metrics or {}

            if "mae" in metrics:
                mae_weighted_sum += float(metrics["mae"]) * num_examples
                mae_examples += num_examples
            if "mape" in metrics:
                mape_weighted_sum += float(metrics["mape"]) * num_examples
                mape_examples += num_examples

        mae = mae_weighted_sum / mae_examples if mae_examples else None
        mape = mape_weighted_sum / mape_examples if mape_examples else None
        return mae, mape

    def _update_prediction(self, rmse: float | None = None, mape: float | None = None):
        """Run global model on recent data; output is per-node kWh → scale by num_nodes for total."""
        if self._global_params is None:
            return
        try:
            from pathlib import Path
            from model.lstm_model import build_lstm_model
            from client.dataset_loader import load_local_dataset
            # Load client 1 data (one node) for prediction
            X, y = load_local_dataset("1")
            if len(X) == 0:
                return
            model = build_lstm_model(input_shape=(X.shape[1], X.shape[2]))
            weights = parameters_to_ndarrays(self._global_params)
            model.set_weights(weights)
            last_seq = X[-1:]
            pred_per_node = float(model.predict(last_seq, verbose=0)[0][0])
            # Model predicts per-node next-hour kWh; scale to total by actual node count
            data_dir = Path(__file__).resolve().parents[1].parent / "data"
            num_nodes_file = data_dir / "num_nodes.txt"
            try:
                num_nodes = max(1, int(num_nodes_file.read_text().strip()))
            except (FileNotFoundError, ValueError):
                num_nodes = 3
            next_hour_total = pred_per_node * num_nodes
            # current_total from training data is not used; API overrides with live sum
            current_total_placeholder = float(np.mean(y[-24:]) * num_nodes) if len(y) >= 24 else float(y[-1] * num_nodes)
            write_prediction(current_total_placeholder, next_hour_total, rmse, mape)
        except Exception as e:
            print(f"Prediction update failed: {e}")
