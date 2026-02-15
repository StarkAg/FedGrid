"""
FedGrid — FedAvg strategy that writes round/loss to fl_state.json for the dashboard.
"""

from flwr.server.strategy import FedAvg
from flwr.server.client_proxy import ClientProxy
from flwr.common import Scalar, EvaluateRes

from backend.fl_state import write_round


class FedAvgWithLogging(FedAvg):
    """FedAvg that persists each round's loss to fl_state.json."""

    def aggregate_evaluate(
        self,
        server_round: int,
        results: list[tuple[ClientProxy, EvaluateRes]],
        failures: list[tuple[ClientProxy, EvaluateRes] | BaseException],
    ) -> tuple[float | None, dict[str, Scalar]]:
        loss_aggregated, metrics_aggregated = super().aggregate_evaluate(
            server_round, results, failures
        )
        if loss_aggregated is not None:
            write_round(server_round, loss_aggregated)
        return loss_aggregated, metrics_aggregated
