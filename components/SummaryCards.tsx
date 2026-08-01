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
  activeNodes?: number;
  totalNodes?: number;
}

export default function SummaryCards({
  meterData,
  isConnected,
  activeNodes,
  totalNodes,
}: SummaryCardsProps) {
  const activeMeters = meterData?.active_meters ?? activeNodes ?? (isConnected ? 1 : 0);
  const configuredMeters = meterData?.total_meters ?? totalNodes ?? 3;
  const isPeak = meterData?.status === 'PEAK';

  const cards = [
    {
      title: 'Node Availability',
      value: `${activeMeters}/${configuredMeters}`,
      unit: 'online',
      helper: `${configuredMeters - activeMeters} reserve or offline`,
      accent: 'var(--accent-color)',
    },
    {
      title: 'Current Draw',
      value: meterData ? meterData.current.toFixed(2) : '--',
      unit: 'A',
      helper: meterData?.meters?.length ? `Average across ${meterData.meters.length} reporting nodes` : 'Awaiting telemetry stream',
      accent: 'var(--signal-color)',
    },
    {
      title: 'Load Condition',
      value: meterData ? (isPeak ? 'PEAK' : 'NOMINAL') : '--',
      unit: 'state',
      helper: isPeak ? 'Demand threshold exceeded on at least one node' : 'Operating inside expected corridor',
      accent: isPeak ? 'var(--error-color)' : 'var(--success-color)',
    },
    {
      title: 'Federation State',
      value: isConnected ? 'READY' : 'IDLE',
      unit: 'sync',
      helper: isConnected ? 'Local training clients available for aggregation' : 'Waiting for active node telemetry',
      accent: isConnected ? 'var(--warning-color)' : 'var(--text-tertiary)',
    },
  ];

  return (
    <div className="grid-auto-fit">
      {cards.map((card) => (
        <div key={card.title} className="card" style={{ padding: '18px 18px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'grid', gap: '8px', flex: 1 }}>
              <span className="eyebrow">{card.title}</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                <span className="metric-value" style={{ fontSize: 'clamp(1.55rem, 3vw, 2rem)', color: card.accent }}>
                  {card.value}
                </span>
                <span className="metric-unit">{card.unit}</span>
              </div>
            </div>

            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '999px',
                background: card.accent,
                boxShadow: `0 0 14px ${card.accent}`,
                flexShrink: 0,
                marginTop: '4px',
              }}
            />
          </div>

          <p
            style={{
              margin: '16px 0 0 0',
              fontSize: '12px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            {card.helper}
          </p>
        </div>
      ))}
    </div>
  );
}
