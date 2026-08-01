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
import ModeToggle from '@/components/ModeToggle';
import MainPanels from '@/components/MainPanels';
import RmseVsRoundsChart from '@/components/RmseVsRoundsChart';
import NodeCards from '@/components/NodeCards';
import { FL_API_URL } from '@/config/fl_api';

// Data structure from VPS API
interface IndividualMeter {
  id: number;
  name: string;
  current: number;
  raw_adc: number;
  status: 'NORMAL' | 'PEAK';
  demand_kwh?: number; // Cumulative demand
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

// All data now comes from VPS cloud backend
const USE_MOCK_DATA = false;

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
  // mockMeters removed - not needed with cloud backend
  const [flRounds, setFlRounds] = useState<{ current_round: number; rounds: { round: number; loss: number }[] } | null>(null);
  const [apiMode, setApiMode] = useState<'simulation' | 'hardware'>('simulation');
  const [nodes, setNodes] = useState<{
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
  }[]>([]);
  const [prediction, setPrediction] = useState<{ current_total_demand: number; next_hour_prediction: number; rmse?: number; mape?: number; accuracy_pct?: number } | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<{ round: number; rmse: number; mae?: number; mape?: number; accuracy_pct?: number }[]>([]);
  const [simNumNodes, setSimNumNodes] = useState(3);
  const [simVariance, setSimVariance] = useState('medium');
  const [simStarting, setSimStarting] = useState(false);
  const [flRerunning, setFlRerunning] = useState(false);
  const [flRerunMessage, setFlRerunMessage] = useState<string | null>(null);
  const [flRerunError, setFlRerunError] = useState(false);
  const [flAutoRerunMinutes, setFlAutoRerunMinutes] = useState<number | null>(null);
  const [relayPending, setRelayPending] = useState<Record<string, boolean>>({});
  const [relayMessage, setRelayMessage] = useState<string | null>(null);
  const [relayError, setRelayError] = useState(false);

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
  // All data fetching happens via VPS API polling below (line ~270)
  // No local ESP8266 or mock data generation

  // Mock data generation removed - all data comes from VPS API

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

  // Poll /mode, /nodes, /prediction, /metrics, /api/fl/auto-rerun
  useEffect(() => {
    if (!isAuthenticated) return;
    const poll = async () => {
      try {
        const [modeRes, nodesRes, predRes, metricsRes, autoRerunRes] = await Promise.all([
          fetch(`${FL_API_URL}/mode`, { cache: 'no-cache' }),
          fetch(`${FL_API_URL}/nodes`, { cache: 'no-cache' }),
          fetch(`${FL_API_URL}/prediction`, { cache: 'no-cache' }),
          fetch(`${FL_API_URL}/metrics`, { cache: 'no-cache' }),
          fetch(`${FL_API_URL}/api/fl/auto-rerun`, { cache: 'no-cache' }),
        ]);
        if (modeRes.ok) {
          const d = await modeRes.json();
          setApiMode(d.mode === 'hardware' ? 'hardware' : 'simulation');
        }
        if (nodesRes.ok) {
          const d = await nodesRes.json();
          const nodeList = d.nodes || [];
          setNodes(nodeList);
          setRelayPending((prev) => {
            const next = { ...prev };
            for (const node of nodeList) {
              if (node.desired_relay_on != null && node.relay_on === node.desired_relay_on) {
                delete next[node.node_id];
              }
            }
            return next;
          });
          
          // Update chart data with current values from nodes
          if (nodeList.length > 0) {
            setIsConnected(true);
            setError(null);
            
            const now = new Date();
            const timeLabel = `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, '0')}`;
            const currentNodes = nodeList
              .filter((node: any) => typeof node.current === 'number')
              .sort((a: any, b: any) => Number(a.node_id) - Number(b.node_id))
              .slice(0, 3);
            const newPoint: any = { time: timeLabel, current: 0 };
            currentNodes.forEach((node: any, idx: number) => {
              newPoint[`node${idx + 1}`] = Number(node.current);
            });
            if (currentNodes.length > 0) {
              newPoint.current = currentNodes.reduce((sum: number, node: any) => sum + Number(node.current), 0) / currentNodes.length;
            }
            setChartData((prev) => {
              const updated = [...prev, newPoint];
              return updated.slice(-20); // Keep last 20 points
            });
            
            // Build meterData for SummaryCards compatibility
            const avgCurrent = nodeList.reduce((sum: number, n: any) => sum + (n.current || 0), 0) / nodeList.length;
            const hasPeak = nodeList.some((n: any) => (n.current || 0) > 3.0);
            setMeterData({
              current: parseFloat(avgCurrent.toFixed(2)),
              raw_adc: Math.round((avgCurrent / 5.0) * 4095),
              status: hasPeak ? 'PEAK' : 'NORMAL',
              timestamp: Date.now(),
              active_meters: nodeList.filter((n: any) => n.online).length,
              total_meters: nodeList.length,
            });
          } else {
            setIsConnected(false);
          }
        }
        if (predRes.ok) {
          const d = await predRes.json();
          setPrediction({
            current_total_demand: d.current_total_demand ?? 0,
            next_hour_prediction: d.next_hour_prediction ?? 0,
            rmse: d.rmse,
            mape: d.mape,
            accuracy_pct: d.accuracy_pct,
          });
        }
        if (metricsRes.ok) {
          const d = await metricsRes.json();
          setMetricsHistory(d.history || []);
        }
        if (autoRerunRes.ok) {
          const d = await autoRerunRes.json();
          setFlAutoRerunMinutes(d.enabled && d.interval_minutes != null ? d.interval_minutes : null);
        }
      } catch {
        // ignore
      }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleStartSimulation = async () => {
    setSimStarting(true);
    try {
      const res = await fetch(`${FL_API_URL}/api/simulation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num_nodes: simNumNodes, variance_level: simVariance }),
      });
      if (!res.ok) {
        alert(`Simulation failed: ${res.status} ${res.statusText}`);
        return;
      }
      const data = await res.json();
      if (data.ok) {
        alert(`✓ Generated ${data.paths?.length || simNumNodes} node CSV files. Node list will update in ~5s.`);
        // Force immediate refetch of /nodes
        setTimeout(() => {
          fetch(`${FL_API_URL}/nodes`, { cache: 'no-cache' }).then(r => r.json()).then(d => setNodes(d.nodes || [])).catch(console.error);
        }, 1000);
      } else {
        alert(`Simulation error: ${data.error || 'Unknown'}`);
      }
    } catch (err) {
      console.error('Start simulation error:', err);
      alert(`Network error: ${err instanceof Error ? err.message : 'Failed to reach API'}`);
    } finally {
      setSimStarting(false);
    }
  };

  const handleRelayToggle = async (nodeId: string, nextRelayOn: boolean) => {
    setRelayMessage(null);
    setRelayError(false);
    setRelayPending((prev) => ({ ...prev, [nodeId]: true }));
    try {
      const res = await fetch(`${FL_API_URL}/api/hardware/relay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node_id: nodeId, relay_on: nextRelayOn }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Relay command failed with ${res.status}`);
      }
      setNodes((prev) =>
        prev.map((node) =>
          node.node_id === nodeId
            ? { ...node, desired_relay_on: nextRelayOn }
            : node
        )
      );
      setRelayMessage(`Node ${nodeId} relay command sent: ${nextRelayOn ? 'ON' : 'OFF'}.`);
      setTimeout(() => setRelayMessage(null), 5000);
    } catch (err) {
      setRelayError(true);
      setRelayMessage(err instanceof Error ? err.message : 'Relay command failed.');
      setRelayPending((prev) => {
        const next = { ...prev };
        delete next[nodeId];
        return next;
      });
    }
  };

  const handleRerunFl = async () => {
    setFlRerunMessage(null);
    setFlRerunError(false);
    setFlRerunning(true);
    try {
      const res = await fetch(`${FL_API_URL}/api/fl/rerun`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setFlRerunMessage(data.message ?? 'FL training started.');
        setTimeout(() => setFlRerunMessage(null), 8000);
      } else {
        setFlRerunError(true);
        setFlRerunMessage(data.error ?? 'Failed to start FL.');
      }
    } catch (err) {
      setFlRerunError(true);
      setFlRerunMessage('Request failed.');
    } finally {
      setFlRerunning(false);
    }
  };

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
        paddingTop: '24px'
      }}>
        <Header isConnected={isConnected} />

        <ModeToggle
          mode={apiMode}
          simulationForm={apiMode === 'simulation' ? {
            numNodes: simNumNodes,
            varianceLevel: simVariance,
            onNumNodesChange: setSimNumNodes,
            onVarianceChange: setSimVariance,
            onStartSimulation: handleStartSimulation,
            starting: simStarting,
          } : undefined}
          hardwareNodes={nodes
            .filter((n) => n.source === 'hardware')
            .map((n) => ({ node_id: n.node_id, online: n.online ?? false, last_update: n.last_update }))}
        />

        <MainPanels
          currentTotalDemand={nodes.length > 0 ? nodes.reduce((sum, n) => sum + (n.power_w ? n.power_w / 1000 : 0), 0) : null}
          nextHourPrediction={prediction?.next_hour_prediction ?? null}
          forecastAccuracyPct={prediction?.accuracy_pct ?? null}
          activeNodes={nodes.length}
          currentRound={flRounds?.current_round ?? 0}
        />
        
        <div style={{ marginTop: '32px' }}>
          <SummaryCards 
            meterData={meterData}
            isConnected={isConnected}
            activeNodes={nodes.filter(n => n.online).length}
            totalNodes={nodes.length}
          />
        </div>

        {/* Live Load Chart - shows real-time current data from all nodes */}
        <div style={{ marginTop: '32px' }}>
          <LiveChart data={chartData} />
        </div>

        {/* FL Training rounds — main proof (show right after chart so it's visible) */}
        <div
          style={{
            marginTop: '32px',
            padding: '22px',
            background: 'linear-gradient(180deg, rgba(16, 30, 48, 0.96), rgba(9, 17, 28, 0.98))',
            border: '1px solid rgba(95, 168, 255, 0.24)',
          }}
          className="card"
          data-theme="card"
        >
          <div style={{ display: 'grid', gap: '6px', marginBottom: '14px' }}>
            <span className="eyebrow">Federated Proof Panel</span>
            <h3 className="panel-title" style={{ margin: 0, fontSize: '1.05rem' }}>
              Training Rounds
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '18px', lineHeight: 1.7 }}>
            Every round shows local learning at each node, secure parameter sharing to the aggregation server, and the
            resulting improvement in the global model. Raw smart-meter readings never enter this table.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleRerunFl}
              disabled={flRerunning}
              className="btn"
              style={{
                cursor: flRerunning ? 'not-allowed' : 'pointer',
                opacity: flRerunning ? 0.7 : 1,
                background: 'linear-gradient(180deg, rgba(95, 168, 255, 0.18), rgba(95, 168, 255, 0.08))',
                borderColor: 'rgba(95, 168, 255, 0.28)',
              }}
            >
              {flRerunning ? 'Starting…' : 'Rerun FL'}
            </button>
            {flRerunMessage && (
              <span
                className="font-mono"
                style={{ fontSize: '12px', color: flRerunError ? 'var(--error-color)' : 'var(--success-color)' }}
              >
                {flRerunMessage}
              </span>
            )}
            {flAutoRerunMinutes != null && flAutoRerunMinutes > 0 && (
              <span className="badge" style={{ background: 'var(--stat-bg)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                Auto rerun every {flAutoRerunMinutes} min
              </span>
            )}
          </div>
          {flRounds && flRounds.rounds.length > 0 ? (
            <>
              <p className="font-mono" style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '12px' }}>
                Current round: <strong style={{ color: 'var(--text-primary)' }}>{flRounds.current_round}</strong> ·
                total recorded rounds: {flRounds.rounds.length}
              </p>
              <div
                style={{
                  overflowX: 'auto',
                  border: '1px solid rgba(106, 146, 193, 0.14)',
                  borderRadius: '14px',
                  background: 'rgba(6, 12, 22, 0.24)',
                }}
              >
                <table className="console-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Round</th>
                      <th style={{ textAlign: 'right' }}>Loss (MSE)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flRounds.rounds.map((r) => (
                      <tr key={r.round}>
                        <td>{r.round}</td>
                        <td style={{ textAlign: 'right' }}>{r.loss.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              No rounds recorded yet. Start one federated run and this panel will populate with round-by-round loss.
            </p>
          )}
        </div>

        <RmseVsRoundsChart history={metricsHistory} />

        {relayMessage && (
          <div
            className="card"
            style={{
              marginTop: '24px',
              padding: '14px 16px',
              border: `1px solid ${relayError ? 'var(--error-border)' : 'rgba(95, 168, 255, 0.24)'}`,
              background: relayError ? 'var(--error-bg)' : 'rgba(95, 168, 255, 0.05)',
              color: relayError ? 'var(--error-color)' : 'var(--text-secondary)',
            }}
          >
            {relayMessage}
          </div>
        )}

        <NodeCards
          nodes={nodes}
          mode={apiMode}
          onRelayToggle={apiMode === 'hardware' ? handleRelayToggle : undefined}
          relayPending={relayPending}
        />

        <div style={{ marginTop: '32px' }}>
          <FederatedLearningStatus isConnected={isConnected} />
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
            Verify the backend, hardware listener, and field node connection.
          </p>
        </div>
      )}
    </div>
  );
}
