# 🔧 Fix: Value Stuck at 2.5

## 🔍 Problem

**Value fixed at 2.5** = `raw_adc: 2048` (exactly half of 4095)

**This means:** A0 is **NOT connected** to potentiometer middle pin!

---

## ✅ Solution: Check A0 Connection

### Step 1: Verify Wiring

```
Potentiometer          Arduino R4
─────────────────      ──────────────
Left Pin (1)      →     3.3V  ✅
Middle Pin (2)    →     A0   ⚠️ CHECK THIS!
Right Pin (3)     →     GND  ✅
```

**The middle pin MUST be connected to A0!**

---

### Step 2: Test Connection

**Quick test:**
1. **Disconnect middle pin from A0**
2. **Touch middle pin to 3.3V** (temporarily)
3. **Check Serial Monitor** → Should read max value (~5.0 A)
4. **Touch middle pin to GND** (temporarily)
5. **Check Serial Monitor** → Should read 0.0 A
6. **If this works, reconnect to A0 properly**

---

### Step 3: Check Serial Monitor

**Open Arduino IDE Serial Monitor (115200 baud):**

You should see:
```
ADC Raw: 2048 | Current: 2.50
ADC Raw: 2048 | Current: 2.50
ADC Raw: 2048 | Current: 2.50
```

**Rotate potentiometer - values should change!**

**If values don't change:**
- ❌ **A0 not connected to middle pin!**
- ❌ **Check wiring!**

---

## 🔍 Common Mistakes

### Mistake 1: Wrong Pin
- **Connected left/right pin to A0** instead of middle pin
- **Fix:** Use **middle pin** (wiper) → A0

### Mistake 2: Loose Connection
- **Wire not pushed in firmly**
- **Fix:** Push wire in securely

### Mistake 3: Wrong Arduino Pin
- **Connected to wrong pin** (not A0)
- **Fix:** Connect to **A0** (Analog Pin 0)

---

## ✅ Correct Wiring

```
        Potentiometer
        ┌───────────┐
        │           │
    [1]─┤           ├─[3]
        │     [2]   │  ← MIDDLE PIN
        └─────┬─────┘
              │
         ┌────┴────┐
    Arduino R4    │
    ┌─────────┐   │
    │ 3.3V ───┼───┘ (Pin 1)
    │ A0  ────┘ (Pin 2 - MIDDLE) ⚠️ KEY CONNECTION!
    │ GND ────┘ (Pin 3)
    └─────────┘
```

---

## 🎯 Quick Fix

1. **Find middle pin** on potentiometer (usually marked or in center)
2. **Connect to A0** on Arduino R4
3. **Verify connection is secure**
4. **Rotate potentiometer**
5. **Values should change!**

---

## 📝 Test After Fix

**After fixing connection:**
1. **Open Serial Monitor**
2. **Rotate potentiometer**
3. **Should see:**
   ```
   ADC Raw: 0 | Current: 0.00
   ADC Raw: 1024 | Current: 1.25
   ADC Raw: 2048 | Current: 2.50
   ADC Raw: 3072 | Current: 3.75
   ADC Raw: 4095 | Current: 5.00
   ```

**Values should change when rotating!**

---

**Check middle pin → A0 connection - that's the issue!** 🔌
