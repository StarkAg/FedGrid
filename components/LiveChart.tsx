'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: string;
  current: number;
  node1?: number;
  node2?: number;
  node3?: number;
}

interface LiveChartProps {
  data: ChartDataPoint[];
}

export default function LiveChart({ data }: LiveChartProps) {
  // Check if we have multi-meter data
  const hasMultiMeterData = data.length > 0 && data[0].node1 !== undefined;

  return (
    <div className="card">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Live Load Chart
        </h2>
        
        {hasMultiMeterData && (
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            fontSize: '12px', 
            fontWeight: 600,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '16px', 
                height: '3px', 
                background: '#3b82f6', 
                borderRadius: '2px' 
              }} />
              <span style={{ color: 'var(--text-secondary)' }}>Node 1</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '16px', 
                height: '3px', 
                background: '#10b981', 
                borderRadius: '2px' 
              }} />
              <span style={{ color: 'var(--text-secondary)' }}>Node 2</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '16px', 
                height: '3px', 
                background: '#f59e0b', 
                borderRadius: '2px' 
              }} />
              <span style={{ color: 'var(--text-secondary)' }}>Node 3</span>
            </div>
          </div>
        )}
      </div>
      
      {data.length === 0 ? (
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-tertiary)'
        }}>
          <p>Waiting for data...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border-color)"
              opacity={0.3}
            />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-secondary)"
              style={{ fontSize: '11px' }}
              tick={{ fill: 'var(--text-secondary)' }}
            />
            <YAxis 
              stroke="var(--text-secondary)"
              domain={[0, 5]}
              label={{ 
                value: 'Current (A)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'var(--text-secondary)', fontSize: '12px' }
              }}
              style={{ fontSize: '11px' }}
              tick={{ fill: 'var(--text-secondary)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 12px var(--shadow-color)',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            
            {hasMultiMeterData ? (
              <>
                <Line
                  type="monotone"
                  dataKey="node1"
                  name="Node 1"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
                <Line
                  type="monotone"
                  dataKey="node2"
                  name="Node 2"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
                <Line
                  type="monotone"
                  dataKey="node3"
                  name="Node 3"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="current"
                name="Current"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5, fill: '#3b82f6' }}
                isAnimationActive={true}
                animationDuration={300}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
      
      <p style={{
        fontSize: '11px',
        color: 'var(--text-tertiary)',
        marginTop: '16px',
        textAlign: 'center'
      }}>
        {hasMultiMeterData 
          ? `Showing last ${data.length} readings for 3 meters • Updates every 400ms`
          : `Showing last ${data.length} readings • Updates every 400ms`
        }
      </p>
    </div>
  );
}
