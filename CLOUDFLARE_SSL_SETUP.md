# Cloudflare SSL Setup for FedGrid

## Current Issue
Error 526: Cloudflare can't validate the SSL certificate on your VPS.

## Solution: Change Cloudflare SSL Mode

### Quick Fix (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain: `gradex.bond`
3. Go to **SSL/TLS** → **Overview**
4. Change SSL/TLS encryption mode from **"Full (strict)"** to **"Full"**
5. Wait 1-2 minutes for propagation

This will make Cloudflare accept the self-signed certificate on your VPS.

---

## Alternative: Use Cloudflare Origin Certificate (More Secure)

If you want to keep "Full (strict)" mode:

### Step 1: Create Origin Certificate in Cloudflare

1. Go to Cloudflare Dashboard → **SSL/TLS** → **Origin Server**
2. Click **"Create Certificate"**
3. Keep default settings:
   - Let Cloudflare generate a private key and CSR
   - Hostnames: `*.gradex.bond, gradex.bond`
   - Certificate Validity: 15 years
4. Click **"Create"**
5. **Copy both the certificate and private key** (you'll need them in next step)

### Step 2: Install Certificate on VPS

SSH into your VPS and run:

```bash
# Create certificate file
cat > /etc/ssl/fedgrid/cert.pem <<'EOF'
# Paste your Origin Certificate here (from Cloudflare)
EOF

# Create private key file
cat > /etc/ssl/fedgrid/key.pem <<'EOF'
# Paste your Private Key here (from Cloudflare)
EOF

# Set proper permissions
chmod 600 /etc/ssl/fedgrid/key.pem
chmod 644 /etc/ssl/fedgrid/cert.pem

# Restart Nginx
systemctl restart nginx
```

### Step 3: Verify

```bash
curl -I https://fedgrid.gradex.bond
```

---

## Current Setup

- **VPS**: 65.20.84.46
- **Domain**: fedgrid.gradex.bond
- **Dashboard**: https://fedgrid.gradex.bond
- **API**: https://fedgrid.gradex.bond/health
- **Nginx**: Running with self-signed certificate
- **Services**: 
  - Flask API on localhost:5001
  - Next.js Dashboard on localhost:3000
  - Nginx reverse proxy on ports 80/443

---

## After SSL is Working

Access your dashboard at:
**https://fedgrid.gradex.bond**

No port number needed! Nginx handles the routing.
