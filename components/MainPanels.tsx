'use client';

interface MainPanelsProps {
  currentTotalDemand: number | null;
  nextHourPrediction: number | null;
  forecastAccuracyPct: number | null;
  activeNodes: number;
  currentRound: number;
}

const PANELS = [
  {
    key: 'demand',
    label: 'Current Total Demand',
    description: 'Aggregate live load across all active nodes',
    accent: 'var(--signal-color)',
  },
  {
    key: 'prediction',
    label: 'Next-Hour Forecast',
    description: 'Global model estimate after federation',
    accent: 'var(--accent-strong)',
  },
  {
    key: 'accuracy',
    label: 'Forecast Accuracy',
    description: 'Derived as 100 - MAPE on each client hold-out set',
    accent: 'var(--accent-color)',
  },
  {
    key: 'nodes',
    label: 'Participating Nodes',
    description: 'Active hardware + simulation clients',
    accent: 'var(--success-color)',
  },
  {
    key: 'round',
    label: 'Current FL Round',
    description: 'Latest aggregation cycle in progress',
    accent: 'var(--warning-color)',
  },
] as const;

export default function MainPanels({
  currentTotalDemand,
  nextHourPrediction,
  forecastAccuracyPct,
  activeNodes,
  currentRound,
}: MainPanelsProps) {
  const values = {
    demand: currentTotalDemand != null ? currentTotalDemand.toFixed(2) : '--',
    prediction: nextHourPrediction != null ? nextHourPrediction.toFixed(2) : '--',
    accuracy: forecastAccuracyPct != null ? forecastAccuracyPct.toFixed(1) : '--',
    nodes: String(activeNodes),
    round: String(currentRound),
  };

  const units = {
    demand: 'kW',
    prediction: 'kWh',
    accuracy: '%',
    nodes: 'live',
    round: 'cycle',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {PANELS.map((panel) => (
        <div
          key={panel.key}
          className="card"
          style={{
            padding: '18px 18px 20px',
            minWidth: '180px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ display: 'grid', gap: '8px' }}>
              <span className="eyebrow">{panel.label}</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="metric-value"
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.35rem)',
                    color: panel.accent,
                  }}
                >
                  {values[panel.key]}
                </span>
                <span className="metric-unit">{units[panel.key]}</span>
              </div>
            </div>

            <span
              style={{
                width: '10px',
                height: '10px',
                marginTop: '6px',
                borderRadius: '999px',
                background: panel.accent,
                boxShadow: `0 0 14px ${panel.accent}`,
                flexShrink: 0,
              }}
            />
          </div>

          <p
            style={{
              margin: '16px 0 0 0',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              lineHeight: 1.6,
            }}
          >
            {panel.description}
          </p>
        </div>
      ))}
    </div>
  );
}
