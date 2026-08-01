"""
FedGrid — Continuous simulation service that generates realistic meter data.
Runs in background, updates in-memory state that API serves.
No database: all state is in-memory. Node count is dynamic (set via resize_nodes).
"""

import time
import threading
from datetime import datetime
from typing import List, Dict
import random

NODE_TYPES = ["residential", "industrial", "high_consumption"]


def _make_node(node_id: int, node_type: str, current: float) -> Dict:
    """Create one node dict."""
    return {
        "id": node_id,
        "name": f"Smart Meter Node {node_id}",
        "current": current,
        "voltage": 230.0,
        "raw_adc": int((current / 5.0) * 4095),
        "status": "PEAK" if current > 3.0 else "NORMAL",
        "demand_kwh": 0.0,
        "last_update": datetime.utcnow().isoformat() + "Z",
        "online": True,
        "type": node_type,
    }


class SimulationService:
    """Generates realistic N-node smart meter data continuously. N is set by resize_nodes()."""

    def __init__(self):
        self.running = False
        self.thread = None
        self.nodes: List[Dict] = []
        self._lock = threading.Lock()
        self._init_nodes(3)

    def _init_nodes(self, n: int):
        """Initialize n nodes with starting values."""
        self.nodes = []
        for i in range(1, n + 1):
            t = NODE_TYPES[(i - 1) % len(NODE_TYPES)]
            base = 2.0 if t == "residential" else (1.8 if t == "industrial" else 3.2)
            self.nodes.append(_make_node(i, t, base))
    
    def start(self):
        """Start the simulation service in a background thread."""
        if self.running:
            return
        self.running = True
        self.thread = threading.Thread(target=self._run_loop, daemon=True)
        self.thread.start()
        print("✓ Simulation service started")
    
    def stop(self):
        """Stop the simulation service."""
        self.running = False
        if self.thread:
            self.thread.join(timeout=2)
        print("✓ Simulation service stopped")
    
    def get_nodes(self) -> List[Dict]:
        """Return current node states."""
        with self._lock:
            return list(self.nodes)

    def resize_nodes(self, n: int, variance_level: str = "medium") -> None:
        """
        Set the number of live simulation nodes to n (1..n).
        Called after "Start Simulation" so dashboard and live data match.
        Thread-safe; run loop keeps iterating over current list.
        """
        if n < 1:
            n = 1
        if n > 500:
            n = 500
        change_rate = {"low": 0.1, "medium": 0.2, "high": 0.35}.get(
            (variance_level or "medium").lower(), 0.2
        )
        with self._lock:
            old = {no["id"]: no for no in self.nodes}
            self.nodes = []
            for i in range(1, n + 1):
                t = NODE_TYPES[(i - 1) % len(NODE_TYPES)]
                if i in old:
                    self.nodes.append(old[i])
                    continue
                base = 2.0 if t == "residential" else (1.8 if t == "industrial" else 3.2)
                jitter = (random.random() - 0.5) * change_rate
                self.nodes.append(_make_node(i, t, base + jitter))
            # Trim if shrinking
            self.nodes = self.nodes[:n]
        print(f"✓ Simulation nodes resized to {len(self.nodes)}")

    def _run_loop(self):
        """Main simulation loop - updates every 500ms. Works with any node count."""
        INTERVAL_SEC = 0.5
        VOLTAGE = 230.0
        # Behavior by type (cycle for id > 3)
        BEHAVIOR = {
            "residential": (1.5, 3.5, 0.15),
            "industrial": (0.8, 4.0, 0.35),
            "high_consumption": (2.0, 4.5, 0.5),
        }
        while self.running:
            with self._lock:
                nodes = self.nodes
            for node in nodes:
                min_c, max_c, rate = BEHAVIOR.get(
                    node["type"], BEHAVIOR["residential"]
                )
                current = node["current"] + (random.random() - 0.5) * rate
                current = max(min_c, min(max_c, current))
                power_w = VOLTAGE * current
                energy_kwh_increment = (power_w / 1000.0) * (INTERVAL_SEC / 3600.0)
                demand_kwh = node["demand_kwh"] + energy_kwh_increment
                node["current"] = round(current, 2)
                node["voltage"] = VOLTAGE
                node["raw_adc"] = int((current / 5.0) * 4095)
                node["status"] = "PEAK" if current > 3.0 else "NORMAL"
                node["demand_kwh"] = round(demand_kwh, 6)
                node["power_w"] = round(power_w, 2)
                node["last_update"] = datetime.utcnow().isoformat() + "Z"
                node["online"] = True
            time.sleep(INTERVAL_SEC)

# Global singleton instance
_simulation_service = None

def get_simulation_service() -> SimulationService:
    """Get or create the global simulation service instance."""
    global _simulation_service
    if _simulation_service is None:
        _simulation_service = SimulationService()
    return _simulation_service
