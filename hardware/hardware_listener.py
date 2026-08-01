"""
FedGrid — Hardware mode: accept ESP32 HTTP data; store voltage, current, timestamp; compute kWh.
Save per-node CSV in data/hardware_clients/; track node online/offline and last update.
No ML on ESP32; training runs on local machine.
"""

import sys
import time
from pathlib import Path
from datetime import datetime
from threading import Lock
import json

_root = Path(__file__).resolve().parents[1]
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from flask import Flask, request, jsonify

from backend.config import HARDWARE_DATA_DIR, POLLING_INTERVAL_SEC

app = Flask(__name__)
# Per-node state includes optional smart-meter metadata for the dashboard.
_nodes: dict[str, dict] = {}
_commands: dict[str, bool] = {}
_lock = Lock()


def _online_window_sec() -> float:
    """Treat ESP32 telemetry as live only for a short heartbeat window."""
    return max(15.0, POLLING_INTERVAL_SEC * 3.0)


def _csv_path(node_id: str) -> Path:
    HARDWARE_DATA_DIR.mkdir(parents=True, exist_ok=True)
    return HARDWARE_DATA_DIR / f"client_{node_id}.csv"


def _desired_relay_state(node_id: str, current_relay_on: bool | None = None) -> bool | None:
    if node_id in _commands:
        return _commands[node_id]
    if current_relay_on is not None:
        return current_relay_on
    existing = _nodes.get(node_id, {})
    return existing.get("relay_on")


def _append_reading(
    node_id: str,
    timestamp: str,
    voltage: float,
    current: float,
    power_w: float | None = None,
    status: str | None = None,
    relay_on: bool | None = None,
    rssi: int | None = None,
    energy_wh: float | None = None,
):
    """Compute power and kWh (for this interval), append one row to client CSV."""
    if power_w is None:
        power_w = voltage * current
    # kWh for this interval = power_kW * (interval_hours)
    interval_hours = POLLING_INTERVAL_SEC / 3600.0
    demand_kwh = (power_w / 1000.0) * interval_hours
    path = _csv_path(node_id)
    with _lock:
        with open(path, "a") as f:
            if path.stat().st_size == 0:
                f.write("timestamp,voltage,current,power_w,demand,status,rssi,relay_on,energy_wh\n")
            f.write(
                f"{timestamp},{voltage},{current},{power_w},{demand_kwh},"
                f"{status or ''},{'' if rssi is None else rssi},"
                f"{'' if relay_on is None else int(relay_on)},"
                f"{'' if energy_wh is None else energy_wh}\n"
            )
        _nodes[node_id] = {
            "last_update": timestamp,
            "last_update_epoch": time.time(),
            "voltage": voltage,
            "current": current,
            "power_w": power_w,
            "status": status,
            "relay_on": relay_on,
            "desired_relay_on": _desired_relay_state(node_id, relay_on),
            "rssi": rssi,
            "energy_wh": energy_wh,
        }


@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "fedgrid-hardware-listener"})


# ESP32 can POST or GET with ?node_id=1&voltage=230&current=2.5
@app.route("/data", methods=["GET", "POST"])
def data():
    if request.method == "POST":
        body = request.get_json(silent=True) or {}
        node_id = str(body.get("node_id") or request.args.get("node_id", ""))
        voltage = float(body.get("voltage") or request.args.get("voltage", 230))
        current = float(body.get("current") or request.args.get("current", 0))
        power_w = body.get("power_w")
        status = body.get("status")
        relay_on = body.get("relay_on")
        rssi = body.get("rssi")
        energy_wh = body.get("energy_wh")
    else:
        node_id = str(request.args.get("node_id", ""))
        voltage = float(request.args.get("voltage", 230))
        current = float(request.args.get("current", 0))
        power_w = request.args.get("power_w", type=float)
        status = request.args.get("status")
        relay_on = request.args.get("relay_on")
        rssi = request.args.get("rssi", type=int)
        energy_wh = request.args.get("energy_wh", type=float)
    if not node_id:
        return jsonify({"error": "node_id required"}), 400
    if isinstance(relay_on, str):
        relay_on = relay_on.lower() in {"1", "true", "yes", "on"}
    if power_w is not None:
        power_w = float(power_w)
    if energy_wh is not None:
        energy_wh = float(energy_wh)
    ts = datetime.utcnow().isoformat() + "Z"
    _append_reading(
        node_id,
        ts,
        voltage,
        current,
        power_w=power_w,
        status=status,
        relay_on=relay_on,
        rssi=rssi,
        energy_wh=energy_wh,
    )
    return jsonify({
        "ok": True,
        "node_id": node_id,
        "timestamp": ts,
        "desired_relay_on": _desired_relay_state(node_id, relay_on),
    })


@app.route("/relay", methods=["POST"])
def relay():
    body = request.get_json(silent=True) or {}
    node_id = str(body.get("node_id") or "")
    relay_on = body.get("relay_on")
    if not node_id:
        return jsonify({"error": "node_id required"}), 400
    if relay_on is None:
        return jsonify({"error": "relay_on required"}), 400
    if isinstance(relay_on, str):
        relay_on = relay_on.lower() in {"1", "true", "yes", "on"}
    relay_on = bool(relay_on)
    with _lock:
        _commands[node_id] = relay_on
        if node_id in _nodes:
            _nodes[node_id]["desired_relay_on"] = relay_on
    return jsonify({"ok": True, "node_id": node_id, "desired_relay_on": relay_on})


@app.route("/nodes")
def nodes():
    """List nodes with last_update and online status based on recent heartbeat."""
    with _lock:
        now_epoch = time.time()
        online_window_sec = _online_window_sec()
        out = []
        for nid, data in _nodes.items():
            last_epoch = data.get("last_update_epoch", 0)
            delta_sec = now_epoch - last_epoch
            out.append({
                "node_id": nid,
                "last_update": data["last_update"],
                "voltage": data.get("voltage"),
                "current": data.get("current"),
                "power_w": data.get("power_w"),
                "status": data.get("status"),
                "relay_on": data.get("relay_on"),
                "desired_relay_on": data.get("desired_relay_on"),
                "rssi": data.get("rssi"),
                "energy_wh": data.get("energy_wh"),
                "online": delta_sec < online_window_sec,
            })
    return jsonify({"nodes": out})


def main():
    import os
    port = int(os.environ.get("FEDGRID_HARDWARE_PORT", "5002"))
    app.run(host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
