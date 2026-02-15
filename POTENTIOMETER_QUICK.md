# 🔌 Potentiometer Quick Wiring Guide

## ✅ Simple 3-Wire Connection

```
Potentiometer    →    Arduino R4
─────────────────     ───────────
Left Pin        →     3.3V
Middle Pin      →     A0  ⚠️ SIGNAL WIRE
Right Pin       →     GND
```

---

## 🎯 Key Points

1. **Middle pin (wiper)** → **A0** - This is the signal!
2. **Left pin** → **3.3V** - Power supply
3. **Right pin** → **GND** - Ground

---

## 🔄 How It Works

- **Rotate potentiometer** = Change voltage on A0
- **Arduino reads** voltage (0-3.3V)
- **Converts to** current (0-5.0 A simulated)
- **Dashboard shows** live values!

---

## ✅ Test

1. Upload code
2. Open Serial Monitor
3. Rotate potentiometer
4. See values change!

---

**Middle pin to A0 = That's it!** 🔌
