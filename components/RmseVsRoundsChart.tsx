'use client';

interface RoundMetric {
  round: number;
  rmse: number;
  mae?: number;
  mape?: number;
}

interface RmseVsRoundsChartProps {
  history: RoundMetric[];
}

export default function RmseVsRoundsChart({ history }: RmseVsRoundsChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="card" style={{ padding: '20px', marginTop: '24px' }}>
        <div style={{ display: 'grid', gap: '6px', marginBottom: '12px' }}>
          <span className="eyebrow">Model Error Trend</span>
          <h3 className="panel-title" style={{ margin: 0, fontSize: '1rem' }}>
            RMSE by Round
          </h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
          Start a federated run to populate the round-by-round error chart.
        </p>
      </div>
    );
  }

  const maxRmse = Math.max(...history.map((item) => item.rmse));
  const minRmse = Math.min(...history.map((item) => item.rmse));
  const range = maxRmse - minRmse;
  const height = 220;

  return (
    <div className="card" style={{ padding: '20px', marginTop: '24px' }}>
      <div style={{ display: 'grid', gap: '6px', marginBottom: '16px' }}>
        <span className="eyebrow">Model Error Trend</span>
        <h3 className="panel-title" style={{ margin: 0, fontSize: '1rem' }}>
          RMSE by Round
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '6px',
          height: `${height}px`,
          padding: '14px 12px 12px',
          borderRadius: '14px',
          border: '1px solid rgba(106, 146, 193, 0.14)',
          background: 'rgba(6, 12, 22, 0.24)',
        }}
      >
        {history.map((entry, index) => {
          const normalized = range > 0 ? (entry.rmse - minRmse) / range : 1;
          const barHeight = Math.max(24, normalized * (height - 52) + 24);
          const isLatest = index === history.length - 1;

          return (
            <div
              key={entry.round}
              title={`Round ${entry.round}: RMSE ${entry.rmse.toFixed(4)}`}
              style={{
                flex: 1,
                minWidth: '8px',
                height: `${barHeight}px`,
                borderRadius: '10px 10px 4px 4px',
                background: isLatest
                  ? 'linear-gradient(180deg, var(--signal-color), rgba(77, 227, 255, 0.28))'
                  : 'linear-gradient(180deg, var(--accent-color), rgba(95, 168, 255, 0.2))',
                boxShadow: isLatest ? '0 0 18px rgba(77, 227, 255, 0.16)' : 'none',
                transition: 'opacity 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.opacity = '0.78';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.opacity = '1';
              }}
            />
          );
        })}
      </div>

      <div
        className="font-mono"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}
      >
        <span>Round 1</span>
        <span>Round {history.length}</span>
      </div>

      <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
        RMSE range: {minRmse.toFixed(4)} to {maxRmse.toFixed(4)}
      </div>
    </div>
  );
}
