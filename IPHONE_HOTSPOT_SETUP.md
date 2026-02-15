# 📱 iPhone Hotspot Setup

## 🔍 Situation

- **Arduino R4** is connected to **iPhone Personal Hotspot**
- **IP:** `172.20.10.2` (typical iPhone hotspot range)
- **Mac** needs to connect to **same iPhone hotspot** to communicate

---

## ✅ Solution: Connect Mac to iPhone Hotspot

### Step 1: Enable iPhone Hotspot

1. **On iPhone:** Settings → Personal Hotspot
2. **Turn on:** "Allow Others to Join"
3. **Note the Wi-Fi name** (usually "iPhone" or your name)

---

### Step 2: Connect Mac to iPhone Hotspot

1. **On Mac:** Click Wi-Fi icon in menu bar
2. **Look for:** Your iPhone name (or "iPhone")
3. **Click to connect**
4. **Enter password** (if set)
5. **Wait for connection**

---

### Step 3: Verify Connection

```bash
# Check Mac IP (should be 172.20.10.x)
ifconfig | grep "inet " | grep -v 127.0.0.1

# Test Arduino R4 connection
curl http://172.20.10.2/data
```

**Should return JSON!**

---

### Step 4: Test Dashboard

1. **Proxy is already running** (localhost:8080)
2. **Dashboard is running** (localhost:3000)
3. **Open:** `http://localhost:3000`
4. **Should see live data!**

---

## 📊 Network Setup

```
iPhone Hotspot (172.20.10.1)
    ├── Arduino R4 (172.20.10.2) ✅ Connected
    └── Mac (172.20.10.x) ← Need to connect!
```

**Once Mac connects, both devices can communicate!**

---

## 🔧 Alternative: Use iPhone as Bridge

If you can't connect Mac to hotspot:

1. **Keep Arduino R4 on iPhone hotspot**
2. **Connect Mac to iPhone hotspot too**
3. **Both get 172.20.10.x IPs**
4. **Can communicate directly**

---

## ✅ Quick Steps

1. ✅ **Enable iPhone hotspot** (Settings → Personal Hotspot)
2. ✅ **Connect Mac to iPhone hotspot**
3. ✅ **Wait for IP assignment** (172.20.10.x)
4. ✅ **Test:** `curl http://172.20.10.2/data`
5. ✅ **Open dashboard:** `http://localhost:3000`

---

## 🎯 Why This Works

**iPhone hotspot creates a local network:**
- All connected devices get `172.20.10.x` IPs
- They can communicate with each other
- No internet needed for local communication

---

**Connect Mac to your iPhone hotspot!** 📱
