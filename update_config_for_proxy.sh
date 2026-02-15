#!/bin/bash

# Update dashboard config to use serial proxy

echo "🔄 Updating dashboard config for serial proxy..."
echo ""

# Backup original
cp config/esp8266.ts config/esp8266.ts.backup

# Update to use proxy
cat > config/esp8266.ts << 'EOF'
// ESP8266/Arduino R4 Configuration
// Using Serial Proxy (localhost:8080)

export const ESP8266_IP = 'localhost';
export const ESP8266_API_URL = 'http://localhost:8080/data';
EOF

echo "✅ Config updated to use serial proxy"
echo ""
echo "📝 Next steps:"
echo "   1. Run serial proxy: python3 serial_proxy.py"
echo "   2. Restart dashboard: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
