'use client';

import { useState } from 'react';

const flowItems = [
  { label: 'ESP32 Smart Meter Node', color: 'var(--signal-color)' },
  { label: 'Local Sensor Processing', color: 'var(--success-color)' },
  { label: 'Model Weights Only', color: 'var(--accent-color)' },
  { label: 'Flower Aggregation Server', color: 'var(--warning-color)' },
  { label: 'Operator Dashboard', color: 'var(--error-color)' },
];

export default function DataFlowPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
          marginBottom: isExpanded ? '20px' : '0',
        }}
      >
        <div style={{ display: 'grid', gap: '6px' }}>
          <span className="eyebrow">System Architecture</span>
          <h2 className="panel-title" style={{ margin: 0 }}>
            Data Flow
          </h2>
        </div>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: 'var(--text-secondary)',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isExpanded && (
        <div style={{ animation: 'slideIn 0.3s ease-out' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {flowItems.map((item, index) => (
              <div key={item.label} style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    className="console-dot"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 14px ${item.color}`,
                      flexShrink: 0,
                    }}
                  />
                  <span className="font-mono" style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                    {item.label}
                  </span>
                </div>

                {index < flowItems.length - 1 && (
                  <div style={{ marginLeft: '4px', color: 'var(--text-tertiary)', fontFamily: 'IBM Plex Mono', fontSize: '12px' }}>
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '14px 16px',
              background: 'rgba(6, 12, 22, 0.24)',
              borderRadius: '14px',
              border: '1px solid rgba(106, 146, 193, 0.14)',
            }}
          >
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Judge note:</strong> each node trains on local
              readings, sends only learned parameters to the aggregation server, and the dashboard visualizes the
              resulting global forecast plus live field telemetry.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
