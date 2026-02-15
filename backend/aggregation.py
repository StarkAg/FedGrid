"""
FedGrid — Federated Averaging (Keras weights).
Flower uses this internally; kept for reference and custom strategies.
"""

import numpy as np


def fed_avg(weight_updates: list, num_samples: list):
    """
    Weighted average of Keras get_weights() lists.
    weight_updates: list of (list of numpy arrays) from clients
    num_samples: list of int
    """
    if not weight_updates or len(weight_updates) != len(num_samples):
        raise ValueError("weight_updates and num_samples length mismatch")
    total = sum(num_samples)
    if total == 0:
        raise ValueError("Total samples must be > 0")
    averaged = []
    for layer_weights in zip(*weight_updates):
        # layer_weights: one array per client for this layer
        w = np.average(layer_weights, axis=0, weights=num_samples)
        averaged.append(w.astype(layer_weights[0].dtype))
    return averaged
