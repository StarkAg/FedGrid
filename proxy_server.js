// HTTP Proxy Server - Forward requests to Arduino R4
// Works even if there are network issues

const http = require('http');
const httpProxy = require('http-proxy-middleware');
const express = require('express');

const ARDUINO_IP = '172.20.10.2';
const ARDUINO_PORT = 80;
const PROXY_PORT = 8080;

const app = express();

// Proxy all requests to Arduino R4
app.use('/data', (req, res, next) => {
  const proxy = httpProxy.createProxyMiddleware({
    target: `http://${ARDUINO_IP}:${ARDUINO_PORT}`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[${new Date().toLocaleTimeString()}] Proxying ${req.method} ${req.url} to http://${ARDUINO_IP}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add CORS headers
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type';
      console.log(`[${new Date().toLocaleTimeString()}] Response: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`[${new Date().toLocaleTimeString()}] Proxy error:`, err.message);
      res.status(500).json({ error: 'Failed to connect to Arduino R4', message: err.message });
    }
  });
  proxy(req, res, next);
});

// Handle OPTIONS (CORS preflight)
app.options('/data', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

app.listen(PROXY_PORT, () => {
  console.log('🔗 HTTP Proxy Server');
  console.log('====================');
  console.log(`📡 Forwarding to: http://${ARDUINO_IP}:${ARDUINO_PORT}`);
  console.log(`🌐 Proxy listening on: http://localhost:${PROXY_PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PROXY_PORT}/data`);
  console.log('');
  console.log('✅ Ready! Dashboard can now connect via proxy.');
  console.log('Press Ctrl+C to stop');
});
