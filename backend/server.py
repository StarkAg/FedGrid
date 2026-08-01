"""
FedGrid — Flask API for dashboard. Run: python -m backend.server
Endpoints: /health, /mode, /nodes, /metrics, /round, /prediction, /api/rounds, /api/fl/rerun, /api/fl/auto-rerun
"""

import json
import os
import sys
import subprocess
import time
from pathlib import Path
from flask import Flask, jsonify, request
import urllib.error
import urllib.request

from backend.fl_state import read_state
from backend.metrics import read_metrics
from backend.config import MODE, NUM_NODES, EXPECTED_NODES, CLIENT_TYPES, PROJECT_ROOT, FL_AUTO_RERUN_MINUTES
from backend.simulation_service import get_simulation_service

app = Flask(__name__)
# After POST /api/simulation/start we set this so /nodes returns the generated count
_last_simulation_nodes = None

# Start continuous simulation service on app startup
simulation_service = get_simulation_service()
simulation_service.start()


def _hardware_listener_url() -> str:
    return os.environ.get("FEDGRID_HARDWARE_LISTENER_URL", "http://127.0.0.1:5002")


def _proxy_hardware_post(path: str, body: dict):
    url = f"{_hardware_listener_url()}{path}"
    payload = json.dumps(body).encode()
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode() or "{}")
            return jsonify(data), resp.status
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode() if exc.fp else ""
        try:
            data = json.loads(raw) if raw else {"ok": False, "error": str(exc)}
        except json.JSONDecodeError:
            data = {"ok": False, "error": raw or str(exc)}
        return jsonify(data), exc.code
    except Exception:
        return jsonify({"ok": False, "error": "hardware listener unreachable"}), 502


def _normalize_simulation_node(node: dict, node_id: int) -> dict:
    return {
        "node_id": str(node_id),
        "last_update": node["last_update"],
        "voltage": node["voltage"],
        "current": node["current"],
        "power_w": node.get("power_w", 0),
        "demand_kwh": node.get("demand_kwh", 0),
        "online": node["online"],
        "type": node.get("type"),
        "source": "simulation",
    }


def _online_hardware_node(node_id: str = "1") -> dict | None:
    """Return the live hardware node payload only if the listener marks it online."""
    try:
        with urllib.request.urlopen(f"{_hardware_listener_url()}/nodes", timeout=2) as r:
            data = json.loads(r.read().decode())
            for node in data.get("nodes", []):
                if str(node.get("node_id")) == str(node_id) and bool(node.get("online")):
                    normalized = dict(node)
                    normalized["node_id"] = str(node_id)
                    normalized["source"] = "hardware"
                    return normalized
    except Exception:
        pass
    return None


def _hardware_placeholder_node() -> dict:
    return {
        "node_id": "1",
        "last_update": "",
        "voltage": None,
        "current": None,
        "power_w": None,
        "online": False,
        "type": "real_meter",
        "source": "hardware",
        "status": "Waiting for ESP32",
        "relay_on": None,
        "desired_relay_on": None,
        "rssi": None,
        "energy_wh": None,
    }


def _hardware_mode_nodes() -> list[dict]:
    hardware_nodes: list[dict] = []
    try:
        with urllib.request.urlopen(f"{_hardware_listener_url()}/nodes", timeout=2) as r:
            data = json.loads(r.read().decode())
            for node in data.get("nodes", []):
                normalized = dict(node)
                normalized["source"] = "hardware"
                hardware_nodes.append(normalized)
    except Exception:
        hardware_nodes = []

    used_ids = {str(node.get("node_id")) for node in hardware_nodes}
    mixed_nodes = list(hardware_nodes)
    if "1" not in used_ids:
        mixed_nodes.append(_hardware_placeholder_node())
        used_ids.add("1")

    target_nodes = max(3, len(mixed_nodes), min(EXPECTED_NODES, 3))
    sim_nodes = simulation_service.get_nodes()
    next_id = 2
    for sim in sim_nodes:
        while str(next_id) in used_ids:
            next_id += 1
        if len(mixed_nodes) >= target_nodes:
            break
        mixed_nodes.append(_normalize_simulation_node(sim, next_id))
        used_ids.add(str(next_id))
        next_id += 1

    return sorted(mixed_nodes, key=lambda node: int(str(node.get("node_id", "999"))))


def _simulation_mode_nodes() -> list[dict]:
    """
    Simulation fleet for the dashboard.
    Hardware placeholders are only useful in hardware mode; in simulation mode
    the telemetry chart should receive one live current stream per simulated node.
    """
    target_nodes = max(1, int(_last_simulation_nodes or NUM_NODES or 3))
    simulation_nodes = []
    sim_nodes = simulation_service.get_nodes()
    for idx, sim in enumerate(sim_nodes, start=1):
        if len(simulation_nodes) >= target_nodes:
            break
        simulation_nodes.append(_normalize_simulation_node(sim, idx))

    return simulation_nodes


def run_fl_training():
    """Start FL server + 3 clients in background. Idempotent: stops any existing run first."""
    python = sys.executable
    cwd = str(PROJECT_ROOT)
    env = os.environ.copy()
    log_dir = PROJECT_ROOT / "data"
    log_dir.mkdir(parents=True, exist_ok=True)
    fl_log = log_dir / "fl_server.log"
    client_log = log_dir / "fl_client.log"
    try:
        subprocess.run(
            "pkill -f 'backend.federated_server' || true; pkill -f 'client.client' || true",
            shell=True, cwd=cwd, timeout=5, env=env
        )
        time.sleep(2)
    except Exception:
        pass
    with open(fl_log, "a") as f:
        f.write("\n--- FL run started ---\n")
    with open(fl_log, "a") as out:
        subprocess.Popen(
            [python, "-m", "backend.federated_server"],
            cwd=cwd, env=env, stdout=out, stderr=subprocess.STDOUT, start_new_session=True
        )
    time.sleep(5)
    with open(client_log, "a") as out:
        for i in range(1, 4):
            subprocess.Popen(
                [python, "-m", "client.client", "--id", str(i)],
                cwd=cwd, env=env, stdout=out, stderr=subprocess.STDOUT, start_new_session=True
            )
            time.sleep(0.5)


def _auto_rerun_loop():
    """Background loop: every FL_AUTO_RERUN_MINUTES minutes, trigger FL training."""
    while FL_AUTO_RERUN_MINUTES > 0:
        time.sleep(FL_AUTO_RERUN_MINUTES * 60)
        if FL_AUTO_RERUN_MINUTES <= 0:
            break
        try:
            run_fl_training()
        except Exception as e:
            sys.stderr.write(f"Auto FL rerun failed: {e}\n")


@app.after_request
def _cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


@app.route("/api/simulation/start", methods=["POST", "OPTIONS"])
@app.route("/simulation/start", methods=["POST", "OPTIONS"])  # Nginx may strip /api prefix
def simulation_start():
    global _last_simulation_nodes
    if request.method == "OPTIONS":
        return "", 204
    try:
        from simulation.data_generator import run_simulation
        body = request.get_json(silent=True) or {}
        num_nodes = body.get("num_nodes") or request.args.get("num_nodes", type=int) or 3
        num_nodes = max(1, min(500, int(num_nodes)))
        variance_level = body.get("variance_level") or request.args.get("variance_level") or "medium"
        paths = run_simulation(num_nodes=num_nodes, variance_level=variance_level)
        _last_simulation_nodes = len(paths)
        # Nuclear fix: resize live simulation so dashboard shows the same number of nodes
        simulation_service.resize_nodes(num_nodes, variance_level)
        # So FL strategy can scale next-hour prediction (per-node → total)
        (PROJECT_ROOT / "data").mkdir(parents=True, exist_ok=True)
        (PROJECT_ROOT / "data" / "num_nodes.txt").write_text(str(num_nodes))
        return jsonify({"ok": True, "message": f"Generated {len(paths)} node(s)", "paths": [str(p) for p in paths]})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/fl/rerun", methods=["POST", "OPTIONS"])
@app.route("/fl/rerun", methods=["POST", "OPTIONS"])
def fl_rerun():
    """Start FL server + 3 clients in background (20 rounds). Idempotent: stops any existing run first."""
    if request.method == "OPTIONS":
        return "", 204
    try:
        run_fl_training()
        return jsonify({"ok": True, "message": "FL training started (20 rounds). Rounds will update in a few minutes."})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/fl/auto-rerun", methods=["GET", "OPTIONS"])
def fl_auto_rerun_status():
    """Return whether auto FL rerun is enabled and the interval in minutes."""
    if request.method == "OPTIONS":
        return "", 204
    return jsonify({
        "enabled": FL_AUTO_RERUN_MINUTES > 0,
        "interval_minutes": FL_AUTO_RERUN_MINUTES if FL_AUTO_RERUN_MINUTES > 0 else None,
    })


@app.route("/api/hardware/relay", methods=["POST", "OPTIONS"])
@app.route("/hardware/relay", methods=["POST", "OPTIONS"])
def hardware_relay():
    if request.method == "OPTIONS":
        return "", 204
    body = request.get_json(silent=True) or {}
    node_id = str(body.get("node_id") or "")
    relay_on = body.get("relay_on")
    if not node_id:
        return jsonify({"ok": False, "error": "node_id required"}), 400
    if relay_on is None:
        return jsonify({"ok": False, "error": "relay_on required"}), 400
    return _proxy_hardware_post("/relay", {"node_id": node_id, "relay_on": relay_on})


@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "fedgrid-backend"})


@app.route("/mode")
def mode():
    return jsonify({"mode": MODE})


@app.route("/nodes")
def nodes():
    if MODE == "hardware":
        return jsonify({"mode": "hardware", "nodes": _hardware_mode_nodes()})
    return jsonify({
        "mode": "simulation",
        "nodes": _simulation_mode_nodes(),
    })


@app.route("/metrics")
def metrics():
    return jsonify(read_metrics())


@app.route("/round")
def round_():
    state = read_state()
    return jsonify({"current_round": state.get("current_round", 0)})


@app.route("/prediction")
def prediction():
    state = read_state()
    pred = state.get("prediction") or {}
    # In simulation mode, current total = live sum (same units as dashboard); prediction is already total kWh
    if MODE == "simulation":
        nodes = simulation_service.get_nodes()
        current_total = sum(n.get("demand_kwh", 0) for n in nodes)
    else:
        current_total = pred.get("current_total_demand", 0)
    return jsonify({
        "current_time": pred.get("current_time"),
        "current_total_demand": current_total,
        "next_hour_prediction": pred.get("next_hour_prediction", 0),
        "rmse": pred.get("rmse"),
        "mape": pred.get("mape"),
        "accuracy_pct": pred.get("accuracy_pct"),
    })


@app.route("/api/rounds", methods=["GET", "OPTIONS"])
def rounds():
    if request.method == "OPTIONS":
        return "", 204
    state = read_state()
    return jsonify(state)


def main():
    port = int(os.environ.get("FLASK_PORT", "5001"))
    if FL_AUTO_RERUN_MINUTES > 0:
        import threading
        t = threading.Thread(target=_auto_rerun_loop, daemon=True)
        t.start()
    app.run(host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
