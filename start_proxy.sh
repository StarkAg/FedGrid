#!/bin/bash

# Start HTTP Proxy Server for Arduino R4

echo "🔗 Starting HTTP Proxy Server..."
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Please install Node.js first"
    exit 1
fi

# Start proxy server
echo "📡 Proxy will forward requests to Arduino R4 (172.20.10.2)"
echo "🌐 Proxy listening on: http://localhost:8080"
echo "📊 Endpoint: http://localhost:8080/data"
echo ""
echo "Press Ctrl+C to stop"
echo ""

node proxy_server_simple.js
