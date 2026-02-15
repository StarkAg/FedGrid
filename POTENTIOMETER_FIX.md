# ✅ Potentiometer Fix Applied!

## 🔧 What Was Fixed

**Arduino code now prints potentiometer data to Serial every 500ms!**

The serial proxy can now read live values from the potentiometer.

---

## ✅ Test It

### Step 1: Rotate Potentiometer

**Rotate the potentiometer knob** - values should change!

### Step 2: Check Serial Proxy

```bash
curl http://localhost:8080/data
```

**Rotate potentiometer and run again - values should be different!**

### Step 3: Check Dashboard

1. Open `http://localhost:3000`
2. Rotate potentiometer
3. **Values should update in real-time!**

---

## 🔍 If Still Not Working

### Check Wiring

```
Potentiometer    →    Arduino R4
─────────────────     ───────────
Left Pin        →     3.3V
Middle Pin      →     A0  ⚠️ CHECK THIS!
Right Pin       →     GND
```

**Most common issue:** Middle pin not connected to A0!

### Check Serial Monitor

1. Open Arduino IDE Serial Monitor (115200 baud)
2. Press RESET on Arduino R4
3. Rotate potentiometer
4. **Should see:** `DATA:{"current":X.XX,"raw_adc":XXXX,...}`
5. **Values should change when rotating!**

---

## 📊 Expected Behavior

- **Rotate clockwise** → Current increases (0 → 5.0 A)
- **Rotate counter-clockwise** → Current decreases (5.0 → 0 A)
- **raw_adc** should change: 0 → 4095
- **status** changes: NORMAL → PEAK (when > 3.0 A)

---

## ✅ Quick Checklist

- [ ] Middle pin connected to A0
- [ ] Left pin connected to 3.3V
- [ ] Right pin connected to GND
- [ ] Code uploaded to Arduino R4
- [ ] Serial proxy running
- [ ] Rotate potentiometer
- [ ] Values change!

---

**Rotate the potentiometer and watch values change!** 🔄
