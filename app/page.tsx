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

  // Poll ESP8266 every 400ms
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Note: CORS might be an issue if ESP8266 doesn't send proper headers
        // In production, you'd handle this on the ESP8266 side
        const response = await fetch(ESP8266_API_URL, {
          method: 'GET',
          mode: 'cors', // Attempt CORS, but ESP8266 needs to allow it
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
        
        // For demo purposes, you might want to use mock data if connection fails
        // Uncomment below to test UI without hardware:
        /*
        const mockData: MeterData = {
          current: 2.5 + Math.random() * 1.5,
          raw_adc: 2000 + Math.random() * 1000,
          status: Math.random() > 0.7 ? 'PEAK' : 'NORMAL',
          timestamp: Date.now(),
        };
        setMeterData(mockData);
        setIsConnected(true);
        */
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval (400ms = 2.5 updates per second)
    const interval = setInterval(fetchData, 400);

    return () => clearInterval(interval);
  }, []);

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
            Make sure ESP8266 is connected to Wi-Fi and check Serial Monitor for IP address
          </p>
        </div>
      )}
    </div>
  );
}
