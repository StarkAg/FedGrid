// Simple HTTP Proxy - No dependencies, uses built-in Node.js modules

const http = require('http');
const { URL } = require('url');

const ARDUINO_IP = '172.20.10.2';
const ARDUINO_PORT = 80;
const PROXY_PORT = 8080;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Only proxy /data requests
  if (url.pathname === '/data') {
    console.log(`[${new Date().toLocaleTimeString()}] Proxying ${req.method} ${url.pathname} to Arduino R4`);
    
    const options = {
      hostname: ARDUINO_IP,
      port: ARDUINO_PORT,
      path: url.pathname,
      method: req.method,
      headers: {
        'Host': `${ARDUINO_IP}:${ARDUINO_PORT}`,
        'Connection': 'close'
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json');
      res.writeHead(proxyRes.statusCode);
      
      proxyRes.pipe(res);
      
      console.log(`[${new Date().toLocaleTimeString()}] Response: ${proxyRes.statusCode}`);
    });

    proxyReq.on('error', (err) => {
      console.error(`[${new Date().toLocaleTimeString()}] Proxy error:`, err.message);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to connect to Arduino R4', message: err.message }));
    });

    req.pipe(proxyReq);
    
  } else if (req.method === 'OPTIONS') {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404);
    res.end('Not Found. Use /data endpoint');
  }
});

server.listen(PROXY_PORT, () => {
  console.log('🔗 HTTP Proxy Server (Simple)');
  console.log('==============================');
  console.log(`📡 Forwarding to: http://${ARDUINO_IP}:${ARDUINO_PORT}`);
  console.log(`🌐 Proxy listening on: http://localhost:${PROXY_PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PROXY_PORT}/data`);
  console.log('');
  console.log('✅ Ready! Dashboard can now connect via proxy.');
  console.log('Press Ctrl+C to stop');
  console.log('');
});
