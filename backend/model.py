"""
FedGrid — Global model (re-export from shared LSTM).
"""

from model.lstm_model import build_lstm_model

def get_model_config():
    return {
        "input_seq_len": 24,
        "lstm_units": 64,
        "output_dim": 1,
        "loss": "mse",
    }


def create_model(input_shape=(24, 1), **kwargs):
    return build_lstm_model(input_shape=input_shape)
