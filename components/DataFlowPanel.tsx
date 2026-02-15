'use client';

import { useState } from 'react';

export default function DataFlowPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card">
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
          textAlign: 'left',
          marginBottom: isExpanded ? '24px' : '0'
        }}
      >
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Data Flow / Architecture
        </h2>
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
        <div style={{ animation: 'slideIn 0.3s ease-out' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: "'Space Grotesk', 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            fontSize: '13px'
          }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--text-primary)',
            borderRadius: '50%',
            flexShrink: 0
          }}></div>
          <span style={{ color: 'var(--text-primary)' }}>ESP8266 Smart Meter</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>↓</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--success-color)',
            borderRadius: '50%',
            flexShrink: 0
          }}></div>
          <span style={{ color: 'var(--text-primary)' }}>Local Processing</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>↓</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--text-secondary)',
            borderRadius: '50%',
            flexShrink: 0
          }}></div>
          <span style={{ color: 'var(--text-primary)' }}>Model Parameters Only</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>↓</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--warning-color)',
            borderRadius: '50%',
            flexShrink: 0
          }}></div>
          <span style={{ color: 'var(--text-primary)' }}>Aggregator (Conceptual)</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>↓</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--error-color)',
            borderRadius: '50%',
            flexShrink: 0
          }}></div>
          <span style={{ color: 'var(--text-primary)' }}>Dashboard</span>
        </div>
      </div>
      
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'var(--stat-bg)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> This diagram represents the conceptual flow of federated learning.
              In this demo, the dashboard connects directly to the ESP8266 smart meter via local Wi-Fi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
