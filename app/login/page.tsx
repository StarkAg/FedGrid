'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - in real app, validate credentials
    setTimeout(() => {
      sessionStorage.setItem('hasVisitedLogin', 'true');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Grid Background */}
      <div className="grid-background" style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.4,
        zIndex: 0
      }} />

      {/* Animated Particles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden'
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'var(--text-primary)',
              borderRadius: '50%',
              opacity: 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="card" style={{
        width: '100%',
        maxWidth: '440px',
        margin: '24px',
        padding: '48px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        {/* Electric Grid Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <div className="grid-icon-container" style={{
            position: 'relative',
            width: '80px',
            height: '80px'
          }}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="grid-icon"
            >
              {/* Outer Ring */}
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="var(--text-primary)"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
              
              {/* Power Lines */}
              <line x1="40" y1="10" x2="40" y2="30" stroke="var(--text-primary)" strokeWidth="2" className="power-line" />
              <line x1="40" y1="50" x2="40" y2="70" stroke="var(--text-primary)" strokeWidth="2" className="power-line" />
              <line x1="10" y1="40" x2="30" y2="40" stroke="var(--text-primary)" strokeWidth="2" className="power-line" />
              <line x1="50" y1="40" x2="70" y2="40" stroke="var(--text-primary)" strokeWidth="2" className="power-line" />
              
              {/* Diagonal Lines */}
              <line x1="18" y1="18" x2="30" y2="30" stroke="var(--text-primary)" strokeWidth="2" opacity="0.5" className="power-line" />
              <line x1="62" y1="18" x2="50" y2="30" stroke="var(--text-primary)" strokeWidth="2" opacity="0.5" className="power-line" />
              <line x1="18" y1="62" x2="30" y2="50" stroke="var(--text-primary)" strokeWidth="2" opacity="0.5" className="power-line" />
              <line x1="62" y1="62" x2="50" y2="50" stroke="var(--text-primary)" strokeWidth="2" opacity="0.5" className="power-line" />
              
              {/* Center Power Node */}
              <circle cx="40" cy="40" r="8" fill="var(--text-primary)" className="pulse-node" />
              <circle cx="40" cy="40" r="12" fill="none" stroke="var(--text-primary)" strokeWidth="2" opacity="0.5" className="pulse-ring" />
              
              {/* Corner Nodes */}
              <circle cx="40" cy="10" r="4" fill="var(--text-primary)" opacity="0.8" />
              <circle cx="40" cy="70" r="4" fill="var(--text-primary)" opacity="0.8" />
              <circle cx="10" cy="40" r="4" fill="var(--text-primary)" opacity="0.8" />
              <circle cx="70" cy="40" r="4" fill="var(--text-primary)" opacity="0.8" />
            </svg>
            
            {/* Glow Effect */}
            <div style={{
              position: 'absolute',
              inset: '20%',
              background: 'radial-gradient(circle, var(--text-primary) 0%, transparent 70%)',
              opacity: 0.2,
              animation: 'pulse 3s ease-in-out infinite',
              borderRadius: '50%',
              filter: 'blur(8px)'
            }} />
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-american)',
          letterSpacing: '0.02em'
        }}>
          Fedgrid
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          marginBottom: '32px',
          fontWeight: 500
        }}>
          Smart Grid Federated Learning Platform
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--text-primary)';
                e.target.style.background = 'var(--card-bg)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.background = 'var(--input-bg)';
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--text-primary)';
                e.target.style.background = 'var(--card-bg)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.background = 'var(--input-bg)';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: '8px',
              background: isLoading ? 'var(--text-tertiary)' : 'var(--text-primary)',
              color: 'var(--bg-primary)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-color)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid var(--bg-primary)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
                Authenticating...
              </span>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        {/* Footer Text */}
        <p style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-tertiary)'
        }}>
          Demo Access: Any credentials accepted
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .grid-icon .power-line {
          animation: powerFlow 2s ease-in-out infinite;
        }

        .grid-icon .pulse-node {
          animation: nodePulse 2s ease-in-out infinite;
        }

        .grid-icon .pulse-ring {
          animation: ringPulse 2s ease-in-out infinite;
        }

        @keyframes powerFlow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes nodePulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes ringPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.3);
          }
        }

        .particle {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
