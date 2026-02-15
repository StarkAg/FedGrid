# 🔌 Potentiometer Wiring for Arduino R4

## 📋 Components Needed

- **Arduino R4** (UNO R4 WiFi)
- **Potentiometer** (10kΩ recommended)
- **Jumper wires** (3 wires)

---

## 🔌 Wiring Diagram

```
Potentiometer          Arduino R4
─────────────────      ──────────────
Pin 1 (Left)      →     3.3V (or 5V)
Pin 2 (Middle)    →     A0 (Analog Input)
Pin 3 (Right)     →     GND
```

---

## 📝 Step-by-Step Connections

### Pin 1 (Left Terminal)
- **Connect to:** `3.3V` or `5V` on Arduino R4
- **Purpose:** Power supply (voltage reference)

### Pin 2 (Middle/Wiper Terminal) ⚠️ **MOST IMPORTANT**
- **Connect to:** `A0` (Analog Pin 0) on Arduino R4
- **Purpose:** Reads analog voltage (0-3.3V or 0-5V)
- **This is the signal wire!**

### Pin 3 (Right Terminal)
- **Connect to:** `GND` (Ground) on Arduino R4
- **Purpose:** Ground reference

---

## 🎯 Visual Guide

```
        Potentiometer
        ┌───────────┐
        │           │
    [1]─┤           ├─[3]
        │     [2]   │
        └─────┬─────┘
              │
              │
         ┌────┴────┐
         │         │
    Arduino R4    │
    ┌─────────┐   │
    │ 3.3V ───┼───┘
    │ A0  ────┘
    │ GND ────┘
    └─────────┘
```

---

## ⚡ Power Options

### Option 1: 3.3V (Recommended for Arduino R4)
- **Potentiometer Pin 1** → **Arduino R4 `3.3V`**
- **ADC Range:** 0-4095 (12-bit)
- **Voltage Range:** 0-3.3V

### Option 2: 5V (If Available)
- **Potentiometer Pin 1** → **Arduino R4 `5V`**
- **ADC Range:** 0-4095 (12-bit)
- **Voltage Range:** 0-5V
- **Note:** Arduino R4 may not have 5V pin, use 3.3V

---

## 🔍 How It Works

1. **Potentiometer** acts as a **voltage divider**
2. **Rotating the knob** changes the voltage on the wiper (middle pin)
3. **Arduino R4** reads this voltage on **A0** (Analog Pin 0)
4. **ADC converts** analog voltage (0-3.3V) to digital value (0-4095)
5. **Code converts** ADC value to current (0-5.0 A simulated)

---

## 📊 Code Reference

In `ArduinoR4_SmartMeter.ino`:

```cpp
#define POT_PIN A0  // Analog Pin 0

void readPotentiometer() {
  rawADC = analogRead(POT_PIN);   // 0–4095 (12-bit)
  currentValue = (rawADC / 4095.0) * MAX_CURRENT;  // Convert to 0-5.0A
}
```

---

## ✅ Testing

1. **Upload code** to Arduino R4
2. **Open Serial Monitor** (115200 baud)
3. **Rotate potentiometer**
4. **Watch values change** in Serial Monitor:
   - `raw_adc`: 0-4095
   - `current`: 0.0-5.0 A

---

## 🔧 Troubleshooting

### No Reading / Always 0
- ✅ Check **A0 connection** (middle pin of potentiometer)
- ✅ Check **GND connection** (right pin)
- ✅ Check **power connection** (left pin to 3.3V)

### Reading Always Maximum
- ✅ Check if **A0 is shorted** to 3.3V
- ✅ Verify **potentiometer is working** (test with multimeter)

### Erratic Readings
- ✅ Check **all connections** are secure
- ✅ Use **shorter wires** if possible
- ✅ Check for **loose connections**

---

## 📝 Quick Checklist

- [ ] Potentiometer Pin 1 → Arduino R4 3.3V
- [ ] Potentiometer Pin 2 → Arduino R4 A0 ⚠️ **CRITICAL**
- [ ] Potentiometer Pin 3 → Arduino R4 GND
- [ ] All connections secure
- [ ] Code uploaded to Arduino R4
- [ ] Serial Monitor open (115200 baud)

---

## 🎯 Summary

**Three wires:**
1. **Left pin** → **3.3V** (power)
2. **Middle pin** → **A0** (signal) ⚠️ **Most important!**
3. **Right pin** → **GND** (ground)

**Rotate potentiometer = Change current reading!**

---

**Connect middle pin to A0 - that's the key connection!** 🔌
