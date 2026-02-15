// Node.js Serial Proxy - No Python dependencies!
// Uses serialport npm package

const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const SERIAL_PORT = '/dev/cu.usbmodem4827E2E04AC42';
const SERIAL_BAUD = 115200;
const PROXY_PORT = 8080;

// Store data for 3 smart meters
let meters = [
  {
    id: 1,
    name: "Smart Meter Node 1",
    current: 2.5,
    raw_adc: 2048,
    status: "NORMAL",
    baseValue: 2.5,
    trend: 0,
    behavior: "stable" // stable, variable, peaky
  },
  {
    id: 2,
    name: "Smart Meter Node 2",
    current: 1.8,
    raw_adc: 1474,
    status: "NORMAL",
    baseValue: 1.8,
    trend: 0,
    behavior: "variable"
  },
  {
    id: 3,
    name: "Smart Meter Node 3",
    current: 3.2,
    raw_adc: 2621,
    status: "PEAK",
    baseValue: 3.2,
    trend: 0,
    behavior: "peaky"
  }
];

// Simulation variables
let simulationEnabled = true;
let lastSimulationUpdate = Date.now();

// Generate realistic changing values for a single meter
function simulateMeter(meter) {
  // Behavior-specific parameters
  let changeRate, spikeChance, minVal, maxVal;
  
  switch(meter.behavior) {
    case "stable":
      changeRate = 0.15;
      spikeChance = 0.98; // Rarely spikes
      minVal = 1.5;
      maxVal = 3.5;
      break;
    case "variable":
      changeRate = 0.35;
      spikeChance = 0.95; // Sometimes spikes
      minVal = 0.8;
      maxVal = 4.0;
      break;
    case "peaky":
      changeRate = 0.5;
      spikeChance = 0.90; // Often spikes
      minVal = 2.0;
      maxVal = 4.5;
      break;
  }
  
  // Add random walk behavior
  const change = (Math.random() - 0.5) * changeRate;
  meter.trend += change;
  meter.trend *= 0.95; // Damping factor
  
  // Keep trend reasonable
  if (Math.abs(meter.trend) > 0.5) {
    meter.trend *= 0.7;
  }
  
  // Update base value with trend
  meter.baseValue += meter.trend;
  
  // Add some noise
  const noise = (Math.random() - 0.5) * 0.2;
  let current = meter.baseValue + noise;
  
  // Keep within bounds
  if (current < minVal) {
    current = minVal;
    meter.baseValue = minVal;
    meter.trend = Math.abs(meter.trend);
  }
  if (current > maxVal) {
    current = maxVal;
    meter.baseValue = maxVal;
    meter.trend = -Math.abs(meter.trend);
  }
  
  // Occasionally spike to PEAK
  if (Math.random() > spikeChance) {
    current = 3.2 + Math.random() * 1.3;
  }
  
  // Calculate ADC from current
  const raw_adc = Math.round((current / 5.0) * 4095);
  
  // Determine status
  const status = current > 3.0 ? "PEAK" : "NORMAL";
  
  // Update meter
  meter.current = parseFloat(current.toFixed(2));
  meter.raw_adc = raw_adc;
  meter.status = status;
}

// Generate realistic changing values for all meters
function simulateRealisticData() {
  const now = Date.now();
  
  // Update every 500ms
  if (now - lastSimulationUpdate < 500) {
    return;
  }
  lastSimulationUpdate = now;
  
  // Update each meter
  meters.forEach(meter => simulateMeter(meter));
}

// Get aggregated data (average of all meters)
function getAggregatedData() {
  const avgCurrent = meters.reduce((sum, m) => sum + m.current, 0) / meters.length;
  const avgAdc = Math.round(meters.reduce((sum, m) => sum + m.raw_adc, 0) / meters.length);
  const hasPeak = meters.some(m => m.status === "PEAK");
  
  return {
    current: parseFloat(avgCurrent.toFixed(2)),
    raw_adc: avgAdc,
    status: hasPeak ? "PEAK" : "NORMAL",
    timestamp: Date.now(),
    meters: meters.map(m => ({
      id: m.id,
      name: m.name,
      current: m.current,
      raw_adc: m.raw_adc,
      status: m.status
    })),
    active_meters: meters.length,
    total_meters: 3
  };
}

// Try to connect to serial port
let serialPort = null;
let dataReceived = false;

try {
  serialPort = new SerialPort({ path: SERIAL_PORT, baudRate: SERIAL_BAUD });
  const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

  parser.on('data', (data) => {
    dataReceived = true;
    simulationEnabled = false; // Disable simulation when real data arrives
    const dataStr = data.toString().trim();
    
    // Debug: log all serial data
    console.log(`[${new Date().toLocaleTimeString()}] 📥 Serial:`, dataStr);
    
    // Try to parse JSON from serial output
    try {
      // Look for "DATA:" prefix first
      let jsonStr = dataStr;
      if (dataStr.includes('DATA:')) {
        jsonStr = dataStr.split('DATA:')[1].trim();
      }
      
      const jsonMatch = jsonStr.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Update meter 1 with real data
        meters[0].current = parsed.current;
        meters[0].raw_adc = parsed.raw_adc;
        meters[0].status = parsed.status;
        console.log(`[${new Date().toLocaleTimeString()}] ✅ Parsed JSON for Meter 1:`, parsed);
      }
    } catch (e) {
      // Not JSON, try to extract values from DEBUG output
      const adcMatch = dataStr.match(/ADC[=:]\s*(\d+)/);
      if (adcMatch) {
        const adc = parseInt(adcMatch[1]);
        meters[0].raw_adc = adc;
        meters[0].current = parseFloat(((adc / 4095.0) * 5.0).toFixed(2));
        console.log(`[${new Date().toLocaleTimeString()}] ✅ Extracted ADC for Meter 1:`, adc, 'Current:', meters[0].current);
      }
      
      const currentMatch = dataStr.match(/Current[=:]\s*([\d.]+)/);
      if (currentMatch) {
        meters[0].current = parseFloat(currentMatch[1]);
      }
      
      if (dataStr.includes('PEAK')) meters[0].status = 'PEAK';
      if (dataStr.includes('NORMAL')) meters[0].status = 'NORMAL';
    }
  });

  serialPort.on('error', (err) => {
    console.error('❌ Serial error:', err.message);
  });

  serialPort.on('open', () => {
    console.log('✅ Serial port opened:', SERIAL_PORT);
  });

  console.log('✅ Connected to Arduino R4 via Serial');
  console.log('   Will use real data when available');
} catch (err) {
  console.warn('⚠️  Could not open serial port:', err.message);
  console.warn('   Using simulated realistic data instead');
  simulationEnabled = true;
}

// Start simulation timer
setInterval(() => {
  if (simulationEnabled) {
    simulateRealisticData();
  }
}, 100); // Update simulation every 100ms

// HTTP Server
const server = http.createServer((req, res) => {
  if (req.url === '/data') {
    // If simulation is enabled, generate new data
    if (simulationEnabled) {
      simulateRealisticData();
    }
    
    // Get aggregated data from all meters
    const responseData = getAggregatedData();
    
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    });
    res.end(JSON.stringify(responseData));
    
    // Only log occasionally to avoid spam
    if (Math.random() > 0.95) {
      const source = simulationEnabled ? '🎲 Simulated' : '📡 Real';
      console.log(`[${new Date().toLocaleTimeString()}] ${source}:`, {
        avg: responseData.current,
        status: responseData.status,
        meters: responseData.meters.map(m => `${m.id}:${m.current}A`)
      });
    }
  } else if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
  } else {
    res.writeHead(404);
    res.end('Not Found. Use /data endpoint');
  }
});

server.listen(PROXY_PORT, () => {
  console.log('');
  console.log('🔗 Serial HTTP Proxy (Node.js)');
  console.log('================================');
  console.log(`Serial: ${SERIAL_PORT}`);
  console.log(`Proxy: http://localhost:${PROXY_PORT}`);
  console.log(`Endpoint: http://localhost:${PROXY_PORT}/data`);
  console.log('');
  if (simulationEnabled) {
    console.log('🎲 Simulating 3 SMART METERS:');
    console.log('   • Node 1: Stable behavior (1.5-3.5A)');
    console.log('   • Node 2: Variable behavior (0.8-4.0A)');
    console.log('   • Node 3: Peaky behavior (2.0-4.5A)');
    console.log('');
    console.log('   Dashboard shows AVERAGE of all 3 meters');
    console.log('   (Will switch to real data when Arduino sends it)');
  } else {
    console.log('✅ Using REAL data from Arduino (Meter 1)');
    console.log('   + Simulating Meters 2 & 3');
  }
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});
