'use client';

import { useState } from 'react';

export default function PrivacyNotice() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(180deg, rgba(9, 22, 40, 0.92), rgba(9, 17, 28, 0.98))',
      }}
    >
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
        }}
      >
        <div style={{ display: 'grid', gap: '6px' }}>
          <span className="eyebrow">Privacy Envelope</span>
          <h2 className="panel-title" style={{ margin: 0 }}>
            Raw Data Stays Local
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
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, margin: '0 0 16px 0', fontSize: '14px' }}>
            Each home or node keeps its own voltage and current history. The central server receives model updates,
            not private household consumption logs.
          </p>

          <div
            style={{
              display: 'grid',
              gap: '10px',
              padding: '16px',
              background: 'rgba(6, 12, 22, 0.24)',
              borderRadius: '14px',
              border: '1px solid rgba(106, 146, 193, 0.14)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Shared with server
              </span>
              <span className="badge" style={{ background: 'var(--success-bg)', borderColor: 'var(--success-border)', color: 'var(--success-color)' }}>
                Model weights only
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Raw meter readings
              </span>
              <span className="badge" style={{ background: 'var(--error-bg)', borderColor: 'var(--error-border)', color: 'var(--error-color)' }}>
                Not transmitted
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
