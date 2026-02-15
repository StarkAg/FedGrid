# ✅ Accurate Arduino R4 + Potentiometer Connections

## Hardware Required
- Arduino UNO R4 WiFi
- 10kΩ Potentiometer (3 pins)
- 3 Jumper Wires

---

## Potentiometer Pin Identification

```
     ┌─────────┐
     │    ●    │  ← Adjustment Knob
     └─────────┘
     │    │    │
    Pin1 Pin2 Pin3
    LEFT MID RIGHT
```

**How to identify pins:**
- Hold potentiometer with knob facing you
- 3 pins at the bottom
- LEFT pin = Pin 1
- MIDDLE pin = Pin 2 (wiper/signal)
- RIGHT pin = Pin 3

---

## ✅ CORRECT WIRING (Using A1)

```
Potentiometer          Arduino R4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEFT Pin (Pin 1)   →   3.3V  (red wire)
MIDDLE Pin (Pin 2) →   A1    (yellow wire) ⚡
RIGHT Pin (Pin 3)  →   GND   (black wire)
```

### Visual Diagram

```
Arduino R4                     Potentiometer
┌──────────────┐              ┌─────────────┐
│              │              │      ●      │
│   3.3V ●─────┼──────────────┼──● LEFT     │
│              │  (RED)       │             │
│    A1  ●─────┼──────────────┼──● MIDDLE   │
│              │  (YELLOW)    │             │
│   GND  ●─────┼──────────────┼──● RIGHT    │
│              │  (BLACK)     │             │
└──────────────┘              └─────────────┘
```

---

## ⚠️ CRITICAL NOTES

1. **Use A1, NOT A0** (code is configured for A1)
2. **Middle pin MUST go to A1** (this is the signal)
3. **Left/Right pins can be swapped** (just reverses direction)
4. **Use 3.3V, NOT 5V** (safer for ADC)

---

## 🔍 How to Verify Connections

### Step 1: Physical Check
```bash
# Look at your Arduino R4 and verify:
1. Red wire from potentiometer LEFT pin → Arduino 3.3V
2. Yellow wire from potentiometer MIDDLE pin → Arduino A1
3. Black wire from potentiometer RIGHT pin → Arduino GND
```

### Step 2: Test with Serial Monitor
```bash
# Open Serial Monitor (115200 baud)
# Rotate potentiometer slowly
# You should see:

DEBUG: ADC=0 Current=0.00        # Fully left
DEBUG: ADC=2048 Current=2.50     # Middle position
DEBUG: ADC=4095 Current=5.00     # Fully right
```

### Step 3: If values don't change:
- Middle pin is NOT connected to A1
- Check for loose wires
- Try different jumper wires

---

## 🧪 Quick Test (Touch Test)

**Disconnect middle pin from A1, then:**

1. **Touch middle pin to 3.3V**
   - Serial should show: `ADC=4095 Current=5.00`

2. **Touch middle pin to GND**
   - Serial should show: `ADC=0 Current=0.00`

3. **Reconnect middle pin to A1**
   - Rotate potentiometer, values should change

---

## 📊 Expected ADC Values

| Position      | ADC Value | Current (A) |
|---------------|-----------|-------------|
| Fully Left    | 0         | 0.00        |
| Quarter       | ~1024     | 1.25        |
| Middle        | ~2048     | 2.50        |
| Three-Quarter | ~3072     | 3.75        |
| Fully Right   | 4095      | 5.00        |

---

## 🔧 Troubleshooting

### Problem: Stuck at 2.5A (ADC=2048)
**Cause:** A1 pin is floating (not connected)
**Fix:** Ensure middle pin wire is firmly in A1

### Problem: Always 0.0A (ADC=0)
**Cause:** Middle pin connected to GND
**Fix:** Check wiring, middle should go to A1

### Problem: Always 5.0A (ADC=4095)
**Cause:** Middle pin connected to 3.3V
**Fix:** Check wiring, middle should go to A1

### Problem: Values jump randomly
**Cause:** Loose connection
**Fix:** Push wires firmly into Arduino pins

---

## ✅ Final Checklist

- [ ] Potentiometer LEFT pin → Arduino 3.3V
- [ ] Potentiometer MIDDLE pin → Arduino A1 (NOT A0!)
- [ ] Potentiometer RIGHT pin → Arduino GND
- [ ] All wires firmly connected
- [ ] Arduino connected to Mac via USB
- [ ] Code uploaded to Arduino
- [ ] Serial Monitor shows changing ADC values when rotating

---

## 🚀 After Connections Are Correct

```bash
# 1. Start serial proxy
cd "/Users/mrstark/Desktop/Code PlayGround/FedGrid"
node serial_proxy_node.js

# 2. In another terminal, start Next.js
cd "/Users/mrstark/Desktop/Code PlayGround/FedGrid"
npm run dev

# 3. Open browser
open http://localhost:3000

# 4. Rotate potentiometer → Dashboard updates live!
```

---

## 📸 Photo Reference

Take a photo of your current wiring and compare:
- Red wire should go to 3.3V
- Yellow/signal wire should go to A1
- Black wire should go to GND

---

**If this doesn't work, the potentiometer itself may be faulty. Try a different potentiometer.**
