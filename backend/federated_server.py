"""
FedGrid — Flower FL server (FedAvg). Run from project root: python -m backend.federated_server
"""

import flwr as fl
from model.lstm_model import build_lstm_model
from backend.strategy_with_logging import FedAvgWithLogging
from backend.fl_state import reset_state
from backend.metrics import reset_metrics

INPUT_SHAPE = (24, 1)


def main():
    reset_state()   # Dashboard shows only this run's rounds
    reset_metrics()
    model = build_lstm_model(input_shape=INPUT_SHAPE)
    initial_weights = model.get_weights()
    initial_params = fl.common.ndarrays_to_parameters(initial_weights)

    strategy = FedAvgWithLogging(
        initial_parameters=initial_params,
        min_fit_clients=3,
        min_available_clients=3,
        fraction_evaluate=1.0,  # run client evaluation every round so aggregate_evaluate runs
    )

    fl.server.start_server(
        server_address="0.0.0.0:8085",
        config=fl.server.ServerConfig(num_rounds=20),
        strategy=strategy,
    )


if __name__ == "__main__":
    main()
