'use client';

type Mode = 'simulation' | 'hardware';

interface ModeToggleProps {
  mode: Mode;
  onModeChange?: (mode: Mode) => void;
  simulationForm?: {
    numNodes: number;
    varianceLevel: string;
    onNumNodesChange: (n: number) => void;
    onVarianceChange: (v: string) => void;
    onStartSimulation: () => void;
    starting: boolean;
  };
  hardwareNodes?: { node_id: string; online: boolean; last_update: string }[];
}

export default function ModeToggle({
  mode,
  onModeChange,
  simulationForm,
  hardwareNodes = [],
}: ModeToggleProps) {
  const esp32Node = hardwareNodes.find((node) => node.node_id === '1');
  const esp32Online = Boolean(esp32Node?.online);
  const esp32Label = esp32Online ? 'ESP32 Live Data' : 'Waiting for ESP32';

  const selectedButton = {
    border: '1px solid rgba(95, 168, 255, 0.38)',
    background: 'linear-gradient(180deg, rgba(95, 168, 255, 0.24), rgba(95, 168, 255, 0.12))',
    color: 'var(--text-primary)',
    boxShadow: 'inset 0 1px 0 rgba(151, 211, 255, 0.18)',
  };

  const idleButton = {
    border: '1px solid var(--border-color)',
    background: 'var(--card-bg-form)',
    color: 'var(--text-secondary)',
  };

  return (
    <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', marginBottom: '18px' }}>
        <span className="eyebrow">System Mode</span>
        <h3 className="panel-title" style={{ margin: 0, fontSize: '1rem' }}>
          Telemetry Source Selection
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onModeChange?.('simulation')}
          className="btn"
          style={mode === 'simulation' ? selectedButton : idleButton}
        >
          Simulation Fleet
        </button>
        <button
          type="button"
          onClick={() => onModeChange?.('hardware')}
          className="btn"
          style={mode === 'hardware' ? selectedButton : idleButton}
        >
          Live Hardware Mix
        </button>
      </div>

      <div
        style={{
          marginBottom: '18px',
          padding: '16px',
          borderRadius: '14px',
          border: '1px solid rgba(106, 146, 193, 0.14)',
          background: 'rgba(6, 12, 22, 0.24)',
          display: 'grid',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span
              className="console-dot"
              style={{
                background: esp32Online ? 'var(--success-color)' : 'var(--text-tertiary)',
                boxShadow: esp32Online ? '0 0 12px rgba(73, 209, 125, 0.36)' : 'none',
              }}
            />
            <span className="eyebrow" style={{ margin: 0 }}>
              ESP32 Source
            </span>
            <span
              className="badge"
              style={{
                background: 'var(--stat-bg)',
                borderColor: esp32Online ? 'var(--success-border)' : 'var(--border-color)',
                color: esp32Online ? 'var(--success-color)' : 'var(--text-secondary)',
              }}
            >
              {esp32Label}
            </span>
          </div>
          <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {esp32Node?.last_update ? new Date(esp32Node.last_update).toLocaleTimeString() : '--'}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          {esp32Online
            ? 'Node 1 is currently receiving live telemetry from the ESP32 meter.'
            : 'Node 1 stays reserved for the ESP32 meter and will switch to live hardware data as soon as it reports.'}
        </p>
      </div>

      {mode === 'simulation' && simulationForm && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
            <span className="eyebrow">Nodes</span>
            <input
              type="number"
              min={1}
              max={10}
              value={simulationForm.numNodes}
              onChange={(e) => simulationForm.onNumNodesChange(Number(e.target.value) || 1)}
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                width: '96px',
                fontSize: '14px',
                fontFamily: 'IBM Plex Mono',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
            <span className="eyebrow">Variance Profile</span>
            <select
              value={simulationForm.varianceLevel}
              onChange={(e) => simulationForm.onVarianceChange(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                minWidth: '156px',
                fontSize: '14px',
                fontFamily: 'IBM Plex Mono',
              }}
            >
              <option value="low">Low Drift</option>
              <option value="medium">Medium Drift</option>
              <option value="high">High Drift</option>
            </select>
          </label>

          <button
            type="button"
            onClick={simulationForm.onStartSimulation}
            disabled={simulationForm.starting}
            className="btn"
            style={{
              borderColor: 'rgba(77, 227, 255, 0.28)',
              background: 'linear-gradient(180deg, rgba(77, 227, 255, 0.18), rgba(77, 227, 255, 0.08))',
              color: 'var(--text-primary)',
              cursor: simulationForm.starting ? 'not-allowed' : 'pointer',
              opacity: simulationForm.starting ? 0.72 : 1,
            }}
          >
            {simulationForm.starting ? 'Deploying...' : 'Start Simulation'}
          </button>
        </div>
      )}

      {mode === 'hardware' && (
        <div
          style={{
            marginTop: '8px',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(106, 146, 193, 0.14)',
            background: 'rgba(6, 12, 22, 0.24)',
          }}
        >
          <p className="eyebrow" style={{ marginBottom: '10px' }}>
            Hardware Line Status
          </p>

          {hardwareNodes.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', margin: 0 }}>
              No node has reported yet. Start the hardware listener and let the ESP32 node publish at least one packet.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {hardwareNodes.map((node) => (
                <div
                  key={node.node_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className="console-dot"
                      style={{
                        background: node.online ? 'var(--success-color)' : 'var(--text-tertiary)',
                        boxShadow: node.online ? '0 0 12px rgba(73, 209, 125, 0.36)' : 'none',
                      }}
                    />
                    <span className="font-mono" style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                      Node {node.node_id}
                    </span>
                  </div>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {node.last_update ? new Date(node.last_update).toLocaleTimeString() : '--'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
