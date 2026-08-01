# FedGrid

**Federated Learning–based smart grid demand forecasting for privacy-preserving energy optimization.**

FedGrid is a full-stack system: federated LSTM training (Flower + Keras), dual-mode data (simulation or real hardware via CSV), and a Next.js dashboard for live meters and FL round monitoring. Raw consumption data never leaves the node; only model weights are shared.

| Component        | Tech / Role |
|-----------------|-------------|
| **FL server**   | Flower, FedAvg, port 8085 |
| **Clients**     | Python, Keras LSTM, local data (CSV or synthetic) |
| **API**         | Flask, `/api/rounds`, port 5001 |
| **Dashboard**   | Next.js, Recharts, login, 3-meter view + training table |
| **Data**        | `timestamp`, `demand` — simulation or hardware (ESP32 batch) |

## Architecture (high level)

- **Data layer:** Simulation (synthetic/CSV) or hardware (ESP32 → PC → CSV). Same contract for both.
- **FL clients:** Load data, train LSTM locally, send weights to server.
- **FL server:** Federated Averaging, global model, round persistence for dashboard.
- **Dashboard:** Real-time meter view (mock or proxy) + federated training rounds from API.

## Setup

### Prerequisites

- Node.js 18+ installed
- ESP8266 configured in AP mode
- Device (MacBook/iPhone) connected to ESP8266 Wi-Fi network

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## ESP8266 API Format

The ESP8266 should expose a GET endpoint at `http://192.168.4.1/data` that returns:

```json
{
  "current": 3.6,
  "raw_adc": 2870,
  "status": "PEAK",
  "timestamp": 123456
}
```

## CORS Handling

If you encounter CORS issues, you may need to configure the ESP8266 to send appropriate CORS headers. Alternatively, you can use a browser extension to disable CORS for local development, or modify the ESP8266 code to include:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## Demo Instructions

1. Power on ESP8266 and ensure it's in AP mode
2. Connect your device to the ESP8266 Wi-Fi network
3. Start the Next.js server: `npm run dev`
4. Open `http://localhost:3000` in your browser
5. Rotate the potentiometer connected to ESP8266
6. Watch the dashboard update in real-time!

## Features

- ✅ Real-time data polling (400ms interval)
- ✅ Live current load monitoring
- ✅ Status indicators (Normal/Peak)
- ✅ Interactive line chart (last 20 readings)
- ✅ Federated Learning status display
- ✅ Privacy-preserved architecture visualization
- ✅ Clean, academic styling

## Project Structure

```
├── app/                    # Next.js dashboard (frontend)
│   ├── dashboard/
│   ├── login/
│   ├── layout.tsx
│   └── globals.css
├── components/
├── backend/                # FL aggregator + API (Python)
│   ├── server.py           # API server
│   ├── federated_server.py  # FedAvg / Flower
│   ├── model.py            # Global model
│   └── aggregation.py      # FedAvg logic
├── client/                 # FL clients (smart meter nodes)
│   ├── client.py
│   ├── local_train.py
│   └── dataset_loader.py
├── model/
│   └── lstm_model.py       # LSTM for demand forecasting
├── data/
│   └── sample_clients/     # Per-client CSV data
├── PROJECT_CONTEXT.md      # Full FL project context for Cursor
└── package.json
```

**Project context:** See **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** for the full Federated Learning–based smart grid demand forecasting description (objectives, architecture, LSTM, FedAvg, datasets). Use it in Cursor so generated code matches the FL design.

**Dual-mode data:** The system supports **simulation** (synthetic or CSV) and **hardware** (ESP32 → CSV batch upload) through a single contract: `timestamp`, `demand`. See **[docs/DUAL_MODE.md](./docs/DUAL_MODE.md)**. Switch via `config.MODE` or `FEDGRID_MODE` env.

**Project planning:** See **[docs/GANTT_CHART.md](./docs/GANTT_CHART.md)** for a project-specific Gantt chart you can reuse in reports, presentations, or GitHub.

**Runbook:** `./scripts/start_all.sh start` starts FL server + 2 clients + Flask API. Dashboard shows "Federated training rounds" from `/api/rounds`. Compare centralized vs federated: `python scripts/compare_centralized_federated.py`. Report outline: **[docs/REPORT.md](./docs/REPORT.md)**.

## Troubleshooting

**Connection Issues:**
- Ensure device is connected to ESP8266 Wi-Fi network
- Verify ESP8266 IP is `192.168.4.1`
- Check ESP8266 serial monitor for errors
- Try accessing `http://192.168.4.1/data` directly in browser

**CORS Errors:**
- Configure ESP8266 to send CORS headers
- Use browser with CORS disabled for demo
- Check browser console for specific error messages

## License

Academic project for demonstration purposes.
