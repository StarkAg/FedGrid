"""
FedGrid — LSTM model for next-hour demand forecasting (Keras).
Input: past 24 hours demand; Output: next hour prediction.
"""

import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

INPUT_SEQ_LEN = 24
LSTM_UNITS = 64
OUTPUT_DIM = 1
DROPOUT_RATE = 0.2


def build_lstm_model(input_shape=(INPUT_SEQ_LEN, 1)):
    """Build LSTM for time-series demand prediction. Same architecture on server and clients."""
    model = Sequential([
        LSTM(LSTM_UNITS, input_shape=input_shape),
        Dropout(DROPOUT_RATE),
        Dense(OUTPUT_DIM),
    ])
    model.compile(optimizer="adam", loss="mse", metrics=["mae"])
    return model
