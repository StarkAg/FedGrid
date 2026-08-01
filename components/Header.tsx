'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  isConnected: boolean;
}

export default function Header({ isConnected }: HeaderProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('fedgrid-theme') as 'dark' | 'light' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('fedgrid-theme', newTheme);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        background: 'var(--card-bg-form)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 24px',
        zIndex: 1000,
        backdropFilter: 'blur(18px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.22)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'grid', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span className="eyebrow">FedGrid Operator Console</span>
            <span
              className="badge"
              style={{
                background: 'rgba(95, 168, 255, 0.1)',
                borderColor: 'rgba(95, 168, 255, 0.26)',
                color: 'var(--accent-strong)',
              }}
            >
              ESP32 + Federated Edge Nodes
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(26px, 5vw, 40px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              FedGrid
            </h1>
            <p
              style={{
                margin: 0,
                color: 'var(--text-secondary)',
                fontSize: '14px',
                maxWidth: '720px',
              }}
            >
              Privacy-preserving smart-grid demand forecasting with one live hardware node, two support nodes,
              and round-by-round federated learning telemetry.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <span
            className="badge"
            style={{
              background: isConnected ? 'var(--success-bg)' : 'var(--stat-bg)',
              borderColor: isConnected ? 'var(--success-border)' : 'var(--border-color)',
              color: isConnected ? 'var(--success-color)' : 'var(--text-secondary)',
            }}
          >
            <span
              className="console-dot"
              style={{
                background: isConnected ? 'var(--success-color)' : 'var(--text-tertiary)',
                boxShadow: isConnected ? '0 0 12px rgba(73, 209, 125, 0.38)' : 'none',
                animation: isConnected ? 'pulse 2s infinite' : 'none',
              }}
            />
            {isConnected ? 'Telemetry Live' : 'Awaiting Telemetry'}
          </span>

          <span
            className="badge"
            style={{
              background: 'var(--stat-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            Local Review Environment
          </span>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn"
            style={{
              width: '44px',
              height: '44px',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3c-.02.28-.03.57-.03.86A9 9 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
