'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import MeterCard from '@/components/MeterCard';
import LiveChart from '@/components/LiveChart';
import FederatedLearningStatus from '@/components/FederatedLearningStatus';
import DataFlowPanel from '@/components/DataFlowPanel';
import PrivacyNotice from '@/components/PrivacyNotice';
import Footer from '@/components/Footer';
import { ESP8266_API_URL } from '@/config/esp8266';
import { FL_API_URL } from '@/config/fl_api';

// Data structure from ESP8266/Proxy
interface IndividualMeter {
  id: number;
  name: string;
  current: number;
  raw_adc: number;
  status: 'NORMAL' | 'PEAK';
}

interface MeterData {
  current: number;
  raw_adc: number;
  status: 'NORMAL' | 'PEAK';
  timestamp: number;
  meters?: IndividualMeter[];
  active_meters?: number;
  total_meters?: number;
}

// Toggle this to switch between real API and local mock data
const USE_MOCK_DATA = true;

export default function Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [meterData, setMeterData] = useState<MeterData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{ 
    time: string; 
    current: number;
    node1?: number;
    node2?: number;
    node3?: number;
  }>>([]);
  const [mockMeters, setMockMeters] = useState<IndividualMeter[] | null>(null);
  const [flRounds, setFlRounds] = useState<{ current_round: number; rounds: { round: number; loss: number }[] } | null>(null);

  // Check authentication on mount
  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const hasVisitedLogin = sessionStorage.getItem('hasVisitedLogin');
      if (!hasVisitedLogin) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  // Initialize mock meters when using mock mode
  useEffect(() => {
    if (!USE_MOCK_DATA) return;
    if (mockMeters) return;

    setMockMeters([
      { id: 1, name: 'Smart Meter Node 1', current: 2.5, raw_adc: 2048, status: 'NORMAL' },
      { id: 2, name: 'Smart Meter Node 2', current: 1.8, raw_adc: 1474, status: 'NORMAL' },
      { id: 3, name: 'Smart Meter Node 3', current: 3.2, raw_adc: 2621, status: 'PEAK' }
    ]);
  }, [mockMeters]);

  // Poll ESP8266 every 400ms (disabled when using mock data)
  useEffect(() => {
    if (!isAuthenticated || USE_MOCK_DATA) return;

    const fetchData = async () => {
      try {
        const response = await fetch(ESP8266_API_URL, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MeterData = await response.json();
        setMeterData(data);
        setIsConnected(true);
        setError(null);

        // Update chart data (keep last 20 readings)
        const now = new Date();
        const timeLabel = `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, '0')}`;
        setChartData((prev) => {
          const newDataPoint: { 
            time: string; 
            current: number;
            node1?: number;
            node2?: number;
            node3?: number;
          } = { 
            time: timeLabel, 
            current: data.current 
          };
          
          // If we have individual meter data, add those too
          if (data.meters && data.meters.length >= 3) {
            newDataPoint.node1 = data.meters[0].current;
            newDataPoint.node2 = data.meters[1].current;
            newDataPoint.node3 = data.meters[2].current;
          }
          
          const newData = [...prev, newDataPoint];
          return newData.slice(-20); // Keep last 20 points
        });
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data from ESP8266:', err);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval (400ms = 2.5 updates per second)
    const interval = setInterval(fetchData, 400);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Local mock data generator (3 nodes) when backend/proxy is not running
  useEffect(() => {
    if (!isAuthenticated || !USE_MOCK_DATA || !mockMeters) return;

    const interval = setInterval(() => {
      setMockMeters((prevMeters) => {
        if (!prevMeters) return prevMeters;

        const updated = prevMeters.map((meter) => {
          let min = 1.5;
          let max = 3.5;
          let changeRate = 0.15;

          if (meter.id === 2) {
            // Variable behavior
            min = 0.8;
            max = 4.0;
            changeRate = 0.35;
          } else if (meter.id === 3) {
            // Peaky behavior
            min = 2.0;
            max = 4.5;
            changeRate = 0.5;
          }

          let current = meter.current + (Math.random() - 0.5) * changeRate;
          if (current < min) current = min;
          if (current > max) current = max;

          const raw_adc = Math.round((current / 5.0) * 4095);
          const status: 'NORMAL' | 'PEAK' = current > 3.0 ? 'PEAK' : 'NORMAL';

          return {
            ...meter,
            current: parseFloat(current.toFixed(2)),
            raw_adc,
            status,
          };
        });

        // Build aggregated data
        const avgCurrent =
          updated.reduce((sum, m) => sum + m.current, 0) / updated.length;
        const avgAdc = Math.round(
          updated.reduce((sum, m) => sum + m.raw_adc, 0) / updated.length
        );
        const hasPeak = updated.some((m) => m.status === 'PEAK');
        const timestamp = Date.now();

        const aggregated: MeterData = {
          current: parseFloat(avgCurrent.toFixed(2)),
          raw_adc: avgAdc,
          status: hasPeak ? 'PEAK' : 'NORMAL',
          timestamp,
          meters: updated,
          active_meters: updated.length,
          total_meters: 3,
        };

        setMeterData(aggregated);
        setIsConnected(true);
        setError(null);

        // Update chart data
        const now = new Date();
        const timeLabel = `${now.getMinutes()}:${String(
          now.getSeconds()
        ).padStart(2, '0')}`;

        setChartData((prev) => {
          const newDataPoint = {
            time: timeLabel,
            current: aggregated.current,
            node1: updated[0]?.current,
            node2: updated[1]?.current,
            node3: updated[2]?.current,
          };
          const newData = [...prev, newDataPoint];
          return newData.slice(-20);
        });

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isAuthenticated, mockMeters]);

  // Poll FL backend for training rounds (dashboard ↔ FL API)
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchRounds = async () => {
      try {
        const res = await fetch(`${FL_API_URL}/api/rounds`, { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          setFlRounds({ current_round: data.current_round ?? 0, rounds: data.rounds ?? [] });
        }
      } catch {
        setFlRounds(null);
      }
    };
    fetchRounds();
    const interval = setInterval(fetchRounds, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Calculate time since last update
  const getLastUpdateTime = () => {
    if (!meterData) return 'Never';
    const secondsAgo = Math.floor((Date.now() - meterData.timestamp) / 1000);
    if (secondsAgo < 1) return 'Just now';
    return `${secondsAgo}s ago`;
  };

  // Determine load level based on current
  const getLoadLevel = (current: number): 'Low' | 'Medium' | 'High' => {
    if (current < 1.5) return 'Low';
    if (current <= 3.0) return 'Medium';
    return 'High';
  };

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--text-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '24px',
        paddingTop: '80px'
      }}>
        <Header isConnected={isConnected} />
        
        <div style={{ marginTop: '32px' }}>
          <SummaryCards 
            meterData={meterData}
            isConnected={isConnected}
          />
        </div>

        {/* Individual Meter Cards */}
        {meterData?.meters && meterData.meters.length > 1 && (
          <div className="grid-auto-fit" style={{ marginTop: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {meterData.meters.map((meter) => (
              <MeterCard
                key={meter.id}
                meterData={{
                  current: meter.current,
                  raw_adc: meter.raw_adc,
                  status: meter.status,
                  timestamp: meterData.timestamp
                }}
                lastUpdateTime={getLastUpdateTime()}
                loadLevel={getLoadLevel(meter.current)}
                meterName={meter.name}
              />
            ))}
          </div>
        )}

        {/* Single meter or chart view */}
        {(!meterData?.meters || meterData.meters.length <= 1) && (
          <div className="grid-auto-fit" style={{ marginTop: '32px' }}>
            <MeterCard
              meterData={meterData}
              lastUpdateTime={getLastUpdateTime()}
              loadLevel={meterData ? getLoadLevel(meterData.current) : 'Low'}
            />
            
            <LiveChart data={chartData} />
          </div>
        )}

        {/* Live Chart for multiple meters */}
        {meterData?.meters && meterData.meters.length > 1 && (
          <div style={{ marginTop: '32px' }}>
            <LiveChart data={chartData} />
          </div>
        )}

        <div style={{ marginTop: '32px' }}>
          <FederatedLearningStatus isConnected={isConnected} />
        </div>

        {/* FL Training progress (from backend /api/rounds) */}
        <div style={{ marginTop: '32px' }} className="card" data-theme="card">
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Federated training rounds
          </h3>
          {flRounds && flRounds.rounds.length > 0 ? (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>
                Current round: <strong>{flRounds.current_round}</strong> · Total: {flRounds.rounds.length} round(s)
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)' }}>Round</th>
                      <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text-secondary)' }}>Loss (MSE)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flRounds.rounds.map((r) => (
                      <tr key={r.round} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px 12px', color: 'var(--text-primary)' }}>{r.round}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-primary)' }}>{r.loss.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              No rounds yet. Start the FL server and 2+ clients to see live training progress.
            </p>
          )}
        </div>

        <div className="grid-auto-fit" style={{ marginTop: '32px' }}>
          <DataFlowPanel />
          <PrivacyNotice />
        </div>

        <Footer />
      </div>

      {error && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--error-bg)',
          border: '1px solid var(--error-border)',
          color: 'var(--error-color)',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px var(--shadow-color)',
          maxWidth: '400px',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Connection Error</p>
          <p style={{ fontSize: '13px', marginBottom: '4px', opacity: 0.9 }}>{error}</p>
          <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px' }}>
            Make sure the proxy is running and Arduino is connected
          </p>
        </div>
      )}
    </div>
  );
}
