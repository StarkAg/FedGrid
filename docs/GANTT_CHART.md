# FedGrid Project Gantt Chart

This schedule maps directly to the current FedGrid scope: privacy-preserving demand forecasting, federated LSTM training, dual-mode data ingestion, ESP32 smart meter integration, dashboard delivery, and deployment.

Start date used below: `2026-04-27`.

```mermaid
gantt
    title FedGrid Implementation Schedule
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b

    section Planning
    Problem definition and requirements        :done, a1, 2026-04-27, 7d
    Literature review and objective freeze     :done, a2, after a1, 7d
    Architecture and toolchain finalization    :done, a3, after a2, 7d

    section Data and ML
    Simulation data pipeline setup             :active, b1, 2026-05-18, 10d
    LSTM model design and baseline training    :b2, after b1, 10d
    Federated client training workflow         :b3, after b2, 7d
    FedAvg server integration and metrics      :b4, after b3, 7d

    section Platform
    Flask API and state persistence            :c1, 2026-06-22, 7d
    Dashboard UI and live visualizations       :c2, after c1, 14d
    Dual-mode switching (simulation/hardware)  :c3, after c2, 7d

    section Hardware
    ESP32 firmware and sensor calibration      :d1, 2026-07-20, 10d
    Hardware listener and relay integration    :d2, after d1, 7d
    End-to-end hardware validation             :d3, after d2, 7d

    section Release
    System integration and comparative testing :e1, 2026-08-13, 7d
    Deployment and demo preparation            :e2, after e1, 7d
    Report, slides, and final review           :e3, after e2, 7d
```

## Workstream Summary

| Phase | Main outputs |
|------|--------------|
| Planning | Project scope, objectives, architecture, technology selection |
| Data and ML | Synthetic or CSV data flow, LSTM forecasting model, FL training loop, FedAvg rounds |
| Platform | Flask API, persisted FL state, dashboard metrics, live node monitoring |
| Hardware | ESP32 meter firmware, telemetry ingestion, relay path, sensor validation |
| Release | Integration testing, deployment, documentation, viva/demo assets |

## Notes

- This is a **16-week academic project plan** tailored to the current repository structure.
- If your semester dates differ, keep the task order and shift the start date from `2026-04-27`.
- Mermaid charts render directly on GitHub and in many Markdown viewers.
