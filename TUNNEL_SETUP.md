# 🔗 Tunnel/Proxy Setup for Arduino R4

## ✅ Solution: HTTP Proxy Server

A proxy server will forward requests from your dashboard to Arduino R4, even if there are network issues.

---

## 🚀 Quick Start

### Step 1: Start Proxy Server

```bash
./start_proxy.sh
```

**Or manually:**
```bash
node proxy_server_simple.js
```

**Keep this running in a terminal!**

---

### Step 2: Dashboard Config

✅ **Already updated!** The dashboard config now uses:
- `http://localhost:8080/data` (proxy endpoint)

---

### Step 3: Restart Dashboard

```bash
# Stop current dashboard (Ctrl+C)
npm run dev
```

---

### Step 4: Test

1. **Open:** `http://localhost:3000`
2. **Should see live data!**

---

## 📊 How It Works

```
Dashboard (localhost:3000)
    ↓
Proxy Server (localhost:8080)
    ↓
Arduino R4 (172.20.10.2:80)
```

**The proxy forwards all `/data` requests to Arduino R4!**

---

## 🔧 Configuration

**Proxy Server:**
- Listens on: `localhost:8080`
- Forwards to: `172.20.10.2:80`

**Dashboard:**
- Connects to: `localhost:8080/data`
- Proxy handles forwarding

---

## 📝 Running Both Services

**Terminal 1 - Proxy Server:**
```bash
./start_proxy.sh
```

**Terminal 2 - Dashboard:**
```bash
npm run dev
```

**Both must be running!**

---

## ✅ Status Check

**Test proxy:**
```bash
curl http://localhost:8080/data
```

**Should return JSON from Arduino R4!**

---

## 🎯 Summary

1. ✅ **Start proxy:** `./start_proxy.sh`
2. ✅ **Dashboard config:** Already updated
3. ✅ **Restart dashboard:** `npm run dev`
4. ✅ **Open:** `http://localhost:3000`

---

**Start the proxy server and restart dashboard!** 🚀
