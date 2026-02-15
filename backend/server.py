"""
FedGrid — Flask API for dashboard (health, rounds). Run: python -m backend.server
"""

from flask import Flask, jsonify, request
from backend.fl_state import read_state

app = Flask(__name__)


@app.after_request
def _cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "fedgrid-backend"})


@app.route("/api/rounds", methods=["GET", "OPTIONS"])
def rounds():
    if request.method == "OPTIONS":
        return "", 204
    state = read_state()
    return jsonify(state)


def main():
    app.run(host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
