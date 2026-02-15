"""
FedGrid — Local training and weight get/set (Keras).
"""


def train_local_model(model, X_train, y_train, epochs=3, verbose=0):
    """Train on local data. Returns (updated weights, num_examples)."""
    model.fit(X_train, y_train, epochs=epochs, verbose=verbose, batch_size=32)
    return model.get_weights(), len(X_train)


def get_weights_from_model(model):
    """Keras: list of numpy arrays (for Flower)."""
    return model.get_weights()


def set_weights_on_model(model, weights):
    """Set global weights on local model."""
    model.set_weights(weights)
