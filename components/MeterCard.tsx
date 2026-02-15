interface MeterCardProps {
  meterData: {
    current: number;
    raw_adc: number;
    status: 'NORMAL' | 'PEAK';
    timestamp: number;
  } | null;
  lastUpdateTime: string;
  loadLevel: 'Low' | 'Medium' | 'High';
  meterName?: string;
}

export default function MeterCard({ meterData, lastUpdateTime, loadLevel, meterName = 'Smart Meter – Node 1' }: MeterCardProps) {
  const getLoadLevelStyle = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low':
        return {
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          color: 'var(--success-color)'
        };
      case 'Medium':
        return {
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          color: 'var(--warning-color)'
        };
      case 'High':
        return {
          background: 'var(--error-bg)',
          border: '1px solid var(--error-border)',
          color: 'var(--error-color)'
        };
    }
  };

  return (
    <div className="card">
      <h2 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: '0 0 24px 0',
        letterSpacing: '-0.01em'
      }}>
        {meterName}
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Live Current */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Live Current
          </span>
          <span style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            {meterData ? `${meterData.current.toFixed(2)} A` : '-- A'}
          </span>
        </div>

        {/* Load Level */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Load Level
          </span>
          <span style={{
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            ...getLoadLevelStyle(loadLevel)
          }}>
            {loadLevel}
            {loadLevel === 'Low' && ' (<1.5 A)'}
            {loadLevel === 'Medium' && ' (1.5–3.0 A)'}
            {loadLevel === 'High' && ' (>3.0 A)'}
          </span>
        </div>

        {/* Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Status
          </span>
          <span
            className="status-transition"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              background: meterData?.status === 'PEAK' ? 'var(--error-bg)' : 'var(--success-bg)',
              border: `1px solid ${meterData?.status === 'PEAK' ? 'var(--error-border)' : 'var(--success-border)'}`,
              color: meterData?.status === 'PEAK' ? 'var(--error-color)' : 'var(--success-color)'
            }}
          >
            {meterData ? (meterData.status === 'PEAK' ? 'Peak' : 'Normal') : '--'}
          </span>
        </div>

        {/* Last Update Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Last Update Time
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            {lastUpdateTime}
          </span>
        </div>

        {/* Local Learning Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0'
        }}>
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Local Learning Status
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--success-color)'
          }}>
            {meterData ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Done
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            ) : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
}
