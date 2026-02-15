'use client';

import { useState } from 'react';

export default function PrivacyNotice() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card" style={{
      background: 'var(--stat-bg)',
      border: '1px solid var(--border-color)'
    }}>
      <button
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
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Privacy Preserved
          </h2>
        </div>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: 'var(--text-secondary)',
            flexShrink: 0
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isExpanded && (
        <div style={{ 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <p style={{
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            margin: '0 0 16px 0',
            fontSize: '14px'
          }}>
            Raw electricity usage data never leaves the smart meter.
            Only learned model parameters are shared.
          </p>
          <div style={{
            padding: '16px',
            background: 'var(--card-bg)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Federated Learning Benefit:</strong> The utility can improve
              grid predictions without accessing individual household consumption patterns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
