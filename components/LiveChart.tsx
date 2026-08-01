'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

const seriesColors = {
  node1: 'var(--signal-color)',
  node2: 'var(--success-color)',
  node3: 'var(--warning-color)',
  current: 'var(--accent-color)',
};

export default function LiveChart({ data }: LiveChartProps) {
  const hasMultiMeterData = data.some(
    (point) => point.node1 !== undefined || point.node2 !== undefined || point.node3 !== undefined
  );

  return (
    <div className="card" style={{ paddingBottom: '18px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: '14px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'grid', gap: '6px' }}>
          <span className="eyebrow">Live Telemetry</span>
          <h2 className="panel-title" style={{ margin: 0 }}>
            Node Current Stream
          </h2>
        </div>

        {hasMultiMeterData && (
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {[
              ['Node 1', seriesColors.node1],
              ['Node 2', seriesColors.node2],
              ['Node 3', seriesColors.node3],
            ].map(([label, color]) => (
              <span
                key={label}
                className="badge"
                style={{
                  background: 'var(--stat-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span
                  style={{
                    width: '14px',
                    height: '3px',
                    borderRadius: '999px',
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div
          style={{
            height: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-tertiary)',
            border: '1px dashed var(--border-color)',
            borderRadius: '14px',
            background: 'rgba(6, 12, 22, 0.28)',
          }}
        >
          Waiting for telemetry packets...
        </div>
      ) : (
        <div
          style={{
            height: '320px',
            border: '1px solid rgba(106, 146, 193, 0.14)',
            borderRadius: '14px',
            padding: '14px 12px 6px',
            background: 'rgba(6, 12, 22, 0.45)',
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" />
              <XAxis
                dataKey="time"
                stroke="var(--text-tertiary)"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={{ stroke: 'var(--border-color)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis
                stroke="var(--text-tertiary)"
                domain={[0, 5]}
                tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={{ stroke: 'var(--border-color)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
                label={{
                  value: 'Current (A)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'IBM Plex Mono' },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(7, 14, 24, 0.96)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  boxShadow: '0 18px 36px rgba(0, 0, 0, 0.26)',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                itemStyle={{ color: 'var(--text-secondary)' }}
              />

              {hasMultiMeterData ? (
                <>
                  <Line type="monotone" dataKey="node1" name="Node 1" stroke={seriesColors.node1} strokeWidth={2.4} dot={false} />
                  <Line type="monotone" dataKey="node2" name="Node 2" stroke={seriesColors.node2} strokeWidth={2.4} dot={false} />
                  <Line type="monotone" dataKey="node3" name="Node 3" stroke={seriesColors.node3} strokeWidth={2.4} dot={false} />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="current"
                  name="Current"
                  stroke={seriesColors.current}
                  strokeWidth={2.6}
                  dot={false}
                  activeDot={{ r: 5, fill: 'var(--accent-color)' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p
        className="font-mono"
        style={{
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          marginTop: '14px',
          textAlign: 'center',
        }}
      >
        {hasMultiMeterData
          ? `Displaying ${data.length} recent samples across hardware and reserve nodes`
          : `Displaying ${data.length} recent samples from the active stream`}
      </p>
    </div>
  );
}
