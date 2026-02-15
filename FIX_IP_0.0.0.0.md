# Fix: IP Address 0.0.0.0 on Arduino R4

## 🔍 Problem

Arduino R4 shows:
```
✅ CONNECTED TO WI-FI!
IP Address: 0.0.0.0
```

**This means:** Connected to Wi-Fi but **no IP address assigned** by router.

---

## ✅ Solution 1: Wait for DHCP (Updated Code)

The updated code now **waits for IP assignment**. 

**After uploading new code:**
1. **Press RESET** on Arduino R4
2. **Check Serial Monitor** - it will wait for IP
3. **Should get IP within 15 seconds**

---

## ✅ Solution 2: Check Router Admin Page

1. **Open router admin** (usually `192.168.1.1` or `192.168.0.1`)
2. **Go to "Connected Devices" or "DHCP Clients"**
3. **Look for MAC address:** `48:27:E2:E0:4A:C4`
4. **Note the IP address** assigned to it

---

## ✅ Solution 3: Set Static IP (If Router Allows)

If router supports static IP assignment:

1. **Check router admin** for static IP settings
2. **Assign static IP** to MAC `48:27:E2:E0:4A:C4`
3. **Or configure in code** (see below)

---

## ✅ Solution 4: Restart Router DHCP

Sometimes router DHCP is slow:

1. **Wait 30-60 seconds** after Arduino R4 connects
2. **Press RESET** on Arduino R4
3. **Check Serial Monitor** again
4. **IP should be assigned**

---

## 🔧 Manual IP Check

**Check if Arduino R4 is actually on network:**

```bash
# Scan network for Arduino R4 MAC
arp -a | grep "48:27:e2:e0:4a:c4"

# Or check router admin page
```

---

## 📝 Quick Steps

1. ✅ **Upload updated code** (waits for IP)
2. ✅ **Press RESET** on Arduino R4
3. ✅ **Wait 15-30 seconds** in Serial Monitor
4. ✅ **Check for IP address**
5. ✅ **If still 0.0.0.0, check router admin page**

---

## 🎯 Most Likely Solution

**Check router admin page** - the Arduino R4 is connected (MAC visible), so router should assign IP. Check "Connected Devices" section.

---

**Upload updated code and check router admin page!** 📡
