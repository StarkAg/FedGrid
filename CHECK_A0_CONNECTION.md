# 🔍 Check A0 Connection - Diagnostic Steps

## ✅ If A0 is Connected But Still Fixed at 2.5

### Step 1: Check Serial Monitor Output

**Open Arduino IDE Serial Monitor (115200 baud):**

You should see:
```
DEBUG: ADC=2048 Current=2.50
DATA:{"current":2.5,"raw_adc":2048,"status":"NORMAL","timestamp":12345}
```

**Rotate potentiometer - do ADC values change?**

- ✅ **YES** → ADC changes but proxy not reading → Check serial proxy
- ❌ **NO** → ADC stays at 2048 → **A0 not actually connected!**

---

### Step 2: Verify Physical Connection

**Check these:**

1. **Is wire actually touching A0 pin?**
   - Push wire in firmly
   - Check it's not loose

2. **Is it the correct pin?**
   - A0 is **Analog Pin 0**
   - Not A1, A2, etc.
   - Check Arduino R4 pinout

3. **Is middle pin of potentiometer connected?**
   - Not left or right pin
   - Must be **middle pin** (wiper)

---

### Step 3: Test A0 Directly

**Quick test:**
1. **Disconnect wire from A0**
2. **Touch wire to 3.3V** (temporarily)
3. **Check Serial Monitor** → Should read ~4095 (max)
4. **Touch wire to GND** (temporarily)
5. **Check Serial Monitor** → Should read ~0 (min)

**If this works:**
- ✅ A0 pin is working
- ✅ Problem is potentiometer connection

**If this doesn't work:**
- ❌ A0 pin might be damaged
- ❌ Try different analog pin (A1, A2, etc.)

---

### Step 4: Check Potentiometer

**Test potentiometer:**
1. **Measure resistance** between left and right pins
   - Should be ~10kΩ (or whatever your pot value is)

2. **Measure resistance** between left and middle pin
   - Should **change** when rotating
   - If it doesn't change → Potentiometer broken!

---

### Step 5: Check Power Connections

**Verify:**
- ✅ Left pin → 3.3V (power)
- ✅ Right pin → GND (ground)
- ✅ Middle pin → A0 (signal)

**If power/ground wrong:**
- Potentiometer won't work correctly
- A0 might read constant value

---

## 🔧 Common Issues

### Issue 1: Loose Connection
- **Symptom:** Values fixed or erratic
- **Fix:** Push wires in firmly, check breadboard connections

### Issue 2: Wrong Potentiometer Pin
- **Symptom:** Values don't change
- **Fix:** Use **middle pin** (wiper), not left/right

### Issue 3: Wrong Arduino Pin
- **Symptom:** No reading or wrong values
- **Fix:** Connect to **A0** (Analog Pin 0)

### Issue 4: Potentiometer Broken
- **Symptom:** Values don't change when rotating
- **Fix:** Test with multimeter, replace if broken

---

## 🎯 Quick Diagnostic

**Run this test:**
1. **Open Serial Monitor**
2. **Watch ADC values**
3. **Rotate potentiometer**
4. **Do ADC values change?**

**Results:**
- ✅ **ADC changes** → Connection OK, check serial proxy
- ❌ **ADC fixed at 2048** → A0 not connected or potentiometer issue

---

**Check Serial Monitor - do ADC values change when rotating?** 🔍
