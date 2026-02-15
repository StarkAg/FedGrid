interface MeterData {
  id?: number;
  name?: string;
  current: number;
  raw_adc: number;
  status: 'NORMAL' | 'PEAK';
  timestamp: number;
  meters?: Array<{
    id: number;
    name: string;
    current: number;
    raw_adc: number;
    status: 'NORMAL' | 'PEAK';
  }>;
  active_meters?: number;
  total_meters?: number;
}

interface SummaryCardsProps {
  meterData: MeterData | null;
  isConnected: boolean;
}

export default function SummaryCards({ meterData, isConnected }: SummaryCardsProps) {
  const activeMeters = meterData?.active_meters || (isConnected ? 1 : 0);
  const totalMeters = meterData?.total_meters || 3;

  return (
    <div className="grid-auto-fit">
      {/* Active Smart Meters */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Active Smart Meters
            </p>
            <p style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '12px 0 0 0',
              lineHeight: 1
            }}>
              {activeMeters} / {totalMeters}
            </p>
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Current Load */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {meterData?.meters && meterData.meters.length > 1 ? 'Average Load (Live)' : 'Current Load (Live)'}
            </p>
            <p style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '12px 0 0 0',
              lineHeight: 1
            }}>
              {meterData ? `${meterData.current.toFixed(1)}` : '--'} A
            </p>
            {meterData?.meters && meterData.meters.length > 1 && (
              <p style={{ 
                fontSize: '11px', 
                color: 'var(--text-tertiary)', 
                marginTop: '8px',
                fontWeight: 500
              }}>
                Avg of {meterData.meters.length} meters
              </p>
            )}
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
        </div>
      </div>

      {/* Load Status */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Load Status
            </p>
            <div style={{ marginTop: '12px' }}>
              {meterData ? (
                <span
                  className="status-transition"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: meterData.status === 'PEAK' ? 'var(--error-bg)' : 'var(--success-bg)',
                    border: `1px solid ${meterData.status === 'PEAK' ? 'var(--error-border)' : 'var(--success-border)'}`,
                    color: meterData.status === 'PEAK' ? 'var(--error-color)' : 'var(--success-color)'
                  }}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: meterData.status === 'PEAK' ? 'var(--error-color)' : 'var(--success-color)',
                    animation: 'pulse 2s infinite'
                  }} />
                  {meterData.status === 'PEAK' ? 'PEAK LOAD' : 'NORMAL'}
                </span>
              ) : (
                <span style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: 'var(--stat-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-tertiary)'
                }}>
                  -- --
                </span>
              )}
            </div>
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Federated Learning State */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Federated Learning State
            </p>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Local Training: {isConnected ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Completed
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success-color)' }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                ) : 'Pending'}
              </p>
              <p style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                Global Model: v1.0 (Simulated)
              </p>
            </div>
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
