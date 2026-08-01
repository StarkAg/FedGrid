'use client';

interface NodeInfo {
  node_id: string;
  last_update: string;
  voltage?: number;
  current?: number;
  power_w?: number;
  energy_wh?: number;
  online?: boolean;
  type?: string;
  source?: 'hardware' | 'simulation';
  status?: string;
  relay_on?: boolean;
  desired_relay_on?: boolean;
  rssi?: number;
}

interface NodeCardsProps {
  nodes: NodeInfo[];
  mode: 'simulation' | 'hardware';
  onRelayToggle?: (nodeId: string, nextRelayOn: boolean) => void;
  relayPending?: Record<string, boolean>;
}

const statusColor = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized?.includes('alert')) return 'var(--error-color)';
  if (normalized?.includes('watch') || normalized?.includes('warn')) return 'var(--warning-color)';
  if (normalized?.includes('healthy') || normalized?.includes('normal')) return 'var(--success-color)';
  if (normalized?.includes('offline')) return 'var(--text-tertiary)';
  return 'var(--accent-color)';
};

export default function NodeCards({
  nodes,
  mode,
  onRelayToggle,
  relayPending = {},
}: NodeCardsProps) {
  if (!nodes.length) return null;
  const hasHardwareNode = nodes.some((node) => node.source === 'hardware');

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'grid', gap: '6px', marginBottom: '12px' }}>
        <span className="eyebrow">Node Telemetry</span>
        <h3 className="panel-title" style={{ margin: 0, fontSize: '1rem' }}>
          {hasHardwareNode ? 'Mixed Fleet Status' : 'Simulation Fleet Status'}
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {nodes.map((node) => {
          const sourceLabel = node.source === 'hardware' ? 'Hardware Node' : mode === 'hardware' ? 'Reserve Simulation' : 'Simulation Node';
          const accent = statusColor(node.status);

          return (
            <div
              key={node.node_id}
              className="card"
              style={{
                padding: '18px',
                borderColor: node.online === false ? 'rgba(106, 146, 193, 0.12)' : 'var(--border-color)',
              }}
            >
              {mode === 'hardware' &&
                node.desired_relay_on != null &&
                node.relay_on != null &&
                node.desired_relay_on !== node.relay_on && (
                  <div
                    className="badge"
                    style={{
                      marginBottom: '12px',
                      background: 'rgba(95, 168, 255, 0.08)',
                      borderColor: 'rgba(95, 168, 255, 0.22)',
                      color: 'var(--accent-strong)',
                    }}
                  >
                    Command queued: relay {node.desired_relay_on ? 'ON' : 'OFF'}
                  </div>
                )}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h4 className="font-display" style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Node {node.node_id}
                    </h4>
                    <span
                      className="badge"
                      style={{
                        background: 'var(--stat-bg)',
                        borderColor: 'var(--border-color)',
                        color: node.source === 'hardware' ? 'var(--signal-color)' : 'var(--text-secondary)',
                      }}
                    >
                      {sourceLabel}
                    </span>
                  </div>

                  {node.status && (
                    <span
                      className="badge"
                      style={{
                        background: 'transparent',
                        borderColor: accent,
                        color: accent,
                        justifySelf: 'flex-start',
                      }}
                    >
                      <span className="console-dot" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
                      {node.status}
                    </span>
                  )}
                </div>

                <span
                  title={node.online ? 'Node is online' : 'Node is offline'}
                  style={{
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    background: node.online ? 'var(--success-color)' : 'var(--text-tertiary)',
                    boxShadow: node.online ? '0 0 14px rgba(73, 209, 125, 0.35)' : 'none',
                    marginTop: '8px',
                    flexShrink: 0,
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '10px',
                  marginTop: '16px',
                }}
              >
                {[
                  ['Voltage', node.voltage != null ? `${node.voltage.toFixed(1)} V` : '--'],
                  ['Current', node.current != null ? `${node.current.toFixed(2)} A` : '--'],
                  ['Power', node.power_w != null ? `${(node.power_w / 1000).toFixed(3)} kW` : '--'],
                  ['Energy', node.energy_wh != null ? `${node.energy_wh.toFixed(2)} Wh` : '--'],
                  ...(mode === 'hardware' && node.relay_on != null ? [['Relay', node.relay_on ? 'ON' : 'OFF']] : []),
                  ...(mode === 'hardware' && node.rssi != null ? [['RSSI', `${node.rssi} dBm`]] : []),
                ].map(([label, value]) => (
                  <div
                    key={`${node.node_id}-${label}`}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid rgba(106, 146, 193, 0.14)',
                      background: 'rgba(6, 12, 22, 0.24)',
                    }}
                  >
                    <div className="eyebrow" style={{ marginBottom: '6px' }}>
                      {label}
                    </div>
                    <div className="metric-value" style={{ fontSize: '0.95rem' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {mode === 'hardware' && node.source === 'hardware' && node.relay_on != null && onRelayToggle && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onRelayToggle(node.node_id, true)}
                    disabled={relayPending[node.node_id] || node.relay_on === true}
                    className="btn"
                    style={{
                      background: node.relay_on ? 'var(--success-bg)' : 'var(--card-bg-form)',
                      borderColor: node.relay_on ? 'var(--success-border)' : 'var(--border-color)',
                      color: node.relay_on ? 'var(--success-color)' : 'var(--text-primary)',
                      cursor: relayPending[node.node_id] || node.relay_on === true ? 'not-allowed' : 'pointer',
                      opacity: relayPending[node.node_id] ? 0.72 : 1,
                    }}
                  >
                    {relayPending[node.node_id] && node.desired_relay_on !== false ? 'Sending...' : 'Relay ON'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRelayToggle(node.node_id, false)}
                    disabled={relayPending[node.node_id] || node.relay_on === false}
                    className="btn"
                    style={{
                      background: node.relay_on === false ? 'var(--error-bg)' : 'var(--card-bg-form)',
                      borderColor: node.relay_on === false ? 'var(--error-border)' : 'var(--border-color)',
                      color: node.relay_on === false ? 'var(--error-color)' : 'var(--text-primary)',
                      cursor: relayPending[node.node_id] || node.relay_on === false ? 'not-allowed' : 'pointer',
                      opacity: relayPending[node.node_id] ? 0.72 : 1,
                    }}
                  >
                    {relayPending[node.node_id] && node.desired_relay_on !== true ? 'Sending...' : 'Relay OFF'}
                  </button>
                </div>
              )}

              <div className="console-divider" style={{ marginTop: '16px' }} />
              <p
                className="font-mono"
                style={{
                  margin: '12px 0 0 0',
                  color: 'var(--text-tertiary)',
                  fontSize: '11px',
                }}
              >
                Last packet: {node.last_update ? new Date(node.last_update).toLocaleString() : '--'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
