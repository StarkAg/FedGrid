# 🔧 Troubleshooting: Potentiometer Not Updating

## 🔍 Check These First

### 1. Verify Connections

```
Potentiometer    →    Arduino R4
─────────────────     ───────────
Left Pin        →     3.3V
Middle Pin      →     A0  ⚠️ CHECK THIS!
Right Pin       →     GND
```

**Most common issue:** Middle pin not connected to A0!

---

### 2. Check Serial Proxy is Reading

```bash
curl http://localhost:8080/data
```

**Should return JSON with changing values when you rotate potentiometer!**

---

### 3. Check Arduino Serial Output

**Open Serial Monitor:**
- Tools → Serial Monitor
- Baud: 115200
- Press RESET on Arduino R4
- Rotate potentiometer
- **Should see values changing!**

---

## ✅ Quick Tests

### Test 1: Serial Monitor
1. Open Arduino IDE Serial Monitor
2. Rotate potentiometer
3. **Do values change?**
   - ✅ YES → Connection OK, check serial proxy
   - ❌ NO → Check wiring (especially A0 connection)

### Test 2: Serial Proxy
```bash
# Watch proxy output
curl http://localhost:8080/data

# Rotate potentiometer
# Values should change!
```

### Test 3: Dashboard
1. Open `http://localhost:3000`
2. Rotate potentiometer
3. **Do values update?**
   - ✅ YES → Everything working!
   - ❌ NO → Check serial proxy connection

---

## 🔧 Common Issues

### Issue 1: Wrong Pin Connection
**Symptom:** Values always same or 0

**Fix:**
- ✅ Verify **middle pin** is connected to **A0**
- ✅ Check **left pin** is connected to **3.3V**
- ✅ Check **right pin** is connected to **GND**

### Issue 2: Loose Connection
**Symptom:** Erratic or no readings

**Fix:**
- ✅ Push wires in firmly
- ✅ Check for loose breadboard connections
- ✅ Use shorter wires if possible

### Issue 3: Serial Proxy Not Reading
**Symptom:** Dashboard shows static values

**Fix:**
- ✅ Check serial proxy is running: `lsof -ti:8080`
- ✅ Restart serial proxy: `node serial_proxy_node.js`
- ✅ Check Arduino is sending data to Serial

### Issue 4: Arduino Not Reading Potentiometer
**Symptom:** Serial Monitor shows no change

**Fix:**
- ✅ Check A0 connection (middle pin)
- ✅ Verify potentiometer is working (test with multimeter)
- ✅ Check code is uploaded correctly

---

## 🎯 Step-by-Step Debugging

1. **Check Wiring:**
   - Middle pin → A0? ✅
   - Left pin → 3.3V? ✅
   - Right pin → GND? ✅

2. **Test Arduino:**
   - Open Serial Monitor
   - Rotate potentiometer
   - Values change? ✅

3. **Test Serial Proxy:**
   - `curl http://localhost:8080/data`
   - Rotate potentiometer
   - Values change? ✅

4. **Test Dashboard:**
   - Open `http://localhost:3000`
   - Rotate potentiometer
   - Values update? ✅

---

## 📝 Quick Fix Checklist

- [ ] Middle pin connected to A0
- [ ] Left pin connected to 3.3V
- [ ] Right pin connected to GND
- [ ] All connections secure
- [ ] Serial proxy running
- [ ] Arduino code uploaded
- [ ] Serial Monitor shows changing values

---

**Check A0 connection first - that's usually the issue!** 🔌
