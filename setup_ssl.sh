#!/usr/bin/env bash
# Setup SSL with Cloudflare Origin Certificate (using port 8443 to not disturb existing services)
set -e
VPS="65.20.84.46"
DOMAIN="fedgrid.gradex.bond"

echo "=== Setting up SSL for $DOMAIN on port 8443 ==="
echo ""

ssh root@$VPS "
# Create self-signed certificate (15 year validity)
mkdir -p /etc/ssl/fedgrid
openssl req -x509 -nodes -days 5475 -newkey rsa:2048 \
  -keyout /etc/ssl/fedgrid/key.pem \
  -out /etc/ssl/fedgrid/cert.pem \
  -subj '/CN=$DOMAIN' 2>/dev/null

# Create Nginx config on port 8443 (not 80/443)
cat > /etc/nginx/sites-available/fedgrid <<'EOF'
server {
    listen 8443 ssl http2;
    server_name fedgrid.gradex.bond;
    
    ssl_certificate /etc/ssl/fedgrid/cert.pem;
    ssl_certificate_key /etc/ssl/fedgrid/key.pem;
    
    # Dashboard
    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API endpoints
    location /api {
        rewrite ^/api/(.*) /\$1 break;
        proxy_pass http://localhost:5100;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Enable site (don't touch default or other sites)
ln -sf /etc/nginx/sites-available/fedgrid /etc/nginx/sites-enabled/fedgrid

# Test and reload (not restart to avoid disrupting other services)
nginx -t && systemctl reload nginx

echo '✓ Nginx configured with SSL on port 8443'
"

echo ""
echo "✓ SSL enabled: https://$DOMAIN:8443"
echo "  Dashboard: https://$DOMAIN:8443"
echo "  API: https://$DOMAIN:8443/api/health"
echo ""
echo "Configure Cloudflare:"
echo "1. Go to Cloudflare → DNS → Add A record: fedgrid → $VPS"
echo "2. Go to SSL/TLS → Change to 'Full' mode"
echo "3. Access at https://$DOMAIN:8443"
