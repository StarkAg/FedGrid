interface FederatedLearningStatusProps {
  isConnected: boolean;
}

const blocks = (isConnected: boolean) => [
  {
    title: 'Participating Nodes',
    value: isConnected ? '1 / 3' : '0 / 3',
    helper: 'One live hardware meter plus reserve clients',
    accent: 'var(--signal-color)',
  },
  {
    title: 'Aggregation State',
    value: isConnected ? 'ONLINE' : 'IDLE',
    helper: isConnected ? 'Ready for a new federated round' : 'Waiting for field telemetry',
    accent: isConnected ? 'var(--success-color)' : 'var(--text-tertiary)',
  },
  {
    title: 'Data Shared',
    value: 'WEIGHTS ONLY',
    helper: 'Household readings remain on the node',
    accent: 'var(--warning-color)',
  },
];

export default function FederatedLearningStatus({ isConnected }: FederatedLearningStatusProps) {
  return (
    <div className="card">
      <div style={{ display: 'grid', gap: '6px', marginBottom: '18px' }}>
        <span className="eyebrow">Federated Learning</span>
        <h2 className="panel-title" style={{ margin: 0 }}>
          Aggregation Status
        </h2>
      </div>

      <div className="gradex-form-grid">
        {blocks(isConnected).map((block) => (
          <div
            key={block.title}
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(106, 146, 193, 0.14)',
              background: 'rgba(6, 12, 22, 0.24)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
              <span className="eyebrow">{block.title}</span>
              <span
                className="console-dot"
                style={{
                  background: block.accent,
                  boxShadow: `0 0 12px ${block.accent}`,
                }}
              />
            </div>

            <p className="metric-value" style={{ fontSize: '1.35rem', color: block.accent, margin: '14px 0 8px 0' }}>
              {block.value}
            </p>
            <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {block.helper}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
