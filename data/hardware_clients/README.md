# Hardware clients (MODE=hardware)

Used when `config.MODE == "hardware"`. Place one CSV per smart meter node:

- `client_1.csv`, `client_2.csv`, …

## CSV format (single contract)

| Column     | Description                    |
|-----------|---------------------------------|
| `timestamp` | ISO or parseable datetime (optional; can be index) |
| `demand`    | Consumption (kWh or normalized) per row |

Example:

```csv
timestamp,demand
2024-01-01 00:00:00,1.2
2024-01-01 01:00:00,0.9
...
```

Or simply:

```csv
demand
1.2
0.9
...
```

## How data gets here (batch upload)

1. **ESP32** measures voltage (ZMPT101B) and current (ACS712), computes power = V × I.
2. Node sends readings (e.g. HTTP/MQTT) to a **PC** or gateway.
3. PC (or a small daemon) appends rows to `data/hardware_clients/client_<id>.csv` every 5–15 minutes (batch).
4. Federated client (`client.client`) runs on that PC and calls `load_local_dataset(client_id)`; it reads the latest CSV from this directory.

Training runs on the PC, not on ESP32. ESP32 = smart meter; PC = federated client.

## Switching mode

```bash
export FEDGRID_MODE=hardware
python -m client.client --id 1
```

Or set `MODE = "hardware"` in `config.py`.
