interface FederatedLearningStatusProps {
  isConnected: boolean;
}

export default function FederatedLearningStatus({ isConnected }: FederatedLearningStatusProps) {
  return (
    <div className="card">
      <h2 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: '0 0 24px 0',
        letterSpacing: '-0.01em'
      }}>
        Federated Learning Status
      </h2>
      
      <div className="gradex-form-grid">
        <div style={{
          borderLeft: '3px solid var(--text-primary)',
          paddingLeft: '16px'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Participating Nodes
          </p>
          <p style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '8px 0 0 0',
            lineHeight: 1
          }}>
            {isConnected ? '1' : '0'} / 3
          </p>
        </div>

        <div style={{
          borderLeft: '3px solid var(--success-color)',
          paddingLeft: '16px'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Last Aggregation
          </p>
          <p style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '8px 0 0 0'
          }}>
            {isConnected ? 'Just now' : 'Never'}
          </p>
        </div>

        <div style={{
          borderLeft: '3px solid var(--text-secondary)',
          paddingLeft: '16px'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Data Shared
          </p>
          <p style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '8px 0 4px 0'
          }}>
            Model parameters only
          </p>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            margin: 0
          }}>
            Raw Data Shared: <span style={{ 
              fontWeight: 600, 
              color: 'var(--error-color)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              No
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
