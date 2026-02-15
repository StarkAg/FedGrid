# 🔧 Diagnose Potentiometer Connection

## ⚠️ Values Not Changing?

**Static values mean potentiometer is not connected correctly!**

---

## ✅ Step 1: Verify Wiring

**Check these connections:**

```
Potentiometer          Arduino R4
─────────────────      ──────────────
Left Pin (1)      →     3.3V  ✅
Middle Pin (2)    →     A0   ⚠️ CHECK THIS!
Right Pin (3)     →     GND  ✅
```

**Most common mistake:** Middle pin not connected to A0!

---

## ✅ Step 2: Test with Serial Monitor

1. **Open Arduino IDE**
2. **Tools → Serial Monitor**
3. **Set baud: 115200**
4. **Press RESET on Arduino R4**
5. **Rotate potentiometer**
6. **Look for:** `DATA:{"current":X.XX,"raw_adc":XXXX,...}`

**Do values change when rotating?**
- ✅ **YES** → Wiring OK, check serial proxy
- ❌ **NO** → **Wiring problem!** Check A0 connection

---

## ✅ Step 3: Check A0 Connection

**The middle pin MUST be connected to A0!**

**Test:**
1. **Disconnect middle pin from A0**
2. **Touch it to 3.3V** → Should read max value
3. **Touch it to GND** → Should read 0
4. **If this works, reconnect to A0**

---

## ✅ Step 4: Verify Potentiometer Works

**Test with multimeter:**
1. **Measure between left and right pins** → Should be ~10kΩ
2. **Measure between left and middle** → Should change when rotating
3. **If no change, potentiometer is broken!**

---

## 🔍 Quick Test

**Try this:**
1. **Disconnect middle pin from A0**
2. **Connect middle pin directly to 3.3V** (temporarily)
3. **Check Serial Monitor** → Should read max value
4. **If this works, reconnect to A0 properly**

---

## 📝 Common Issues

### Issue 1: Wrong Pin
- **Symptom:** Values don't change
- **Fix:** Middle pin → A0 (not any other pin!)

### Issue 2: Loose Connection
- **Symptom:** Erratic readings
- **Fix:** Push wires in firmly

### Issue 3: Wrong Potentiometer Pin
- **Symptom:** No reading
- **Fix:** Make sure you're using the MIDDLE pin (wiper)

---

## 🎯 Most Likely Fix

**Check middle pin is connected to A0!**

**Double-check:**
- ✅ Left pin → 3.3V
- ✅ **Middle pin → A0** ⚠️ **THIS IS THE KEY!**
- ✅ Right pin → GND

---

**Check A0 connection - that's usually the problem!** 🔌
