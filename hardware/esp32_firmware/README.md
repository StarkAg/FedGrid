# FedGrid ESP32 firmware — smart meter with LCD, LEDs, buzzer, and AP-mode Wi‑Fi reporting

Firmware for ESP32 that reads **ZMPT101B** (voltage) and **ACS712** (current), shows live data on an I2C 16×2 LCD, drives **relay + buzzer + red/blue LEDs**, starts its own **Wi‑Fi hotspot**, and reports **Node 1** readings to the FedGrid hardware listener so they appear on the local website in hardware mode.

## Arduino CLI (see ports & upload)

**Prereq:** [Arduino CLI](https://arduino.github.io/arduino-cli/). Install once:

```bash
brew install arduino-cli
```

**List serial ports** (see which port the ESP32 is on):

```bash
cd hardware/esp32_firmware
./ports.sh
```

Or directly: `arduino-cli board list`

**Build and upload** (uses first detected port if you don’t pass one):

```bash
cd hardware/esp32_firmware
./upload-arduino-cli.sh
```

**Upload to a specific port:**

```bash
./upload-arduino-cli.sh /dev/cu.usbserial-0001
# or on Windows: ./upload-arduino-cli.sh COM3
```

The script installs the ESP32 core and the **LiquidCrystal I2C** library if missing, then compiles and uploads the `FedGrid_Meter` sketch.

## Build & upload from CLI (PlatformIO)

**Prereq:** [PlatformIO Core](https://docs.platformio.org/en/latest/core/installation.html). Install once:

```bash
pip install -U platformio
# or: brew install platformio
```

Then build and upload:

```bash
cd hardware/esp32_firmware
pio run -t upload
```

- **First time:** `pio run` will download the ESP32 platform and the LiquidCrystal_I2C library.
- **Set port** if auto-detect fails: edit `platformio.ini` and set `upload_port` (e.g. `upload_port = /dev/cu.usbserial-0001` on macOS, or `COM3` on Windows).
- **List ports:** `pio device list`
- **Monitor serial:** `pio device monitor` (115200 baud)

One-liner from repo root:

```bash
cd hardware/esp32_firmware && pio run -t upload
```

Or use the script:

```bash
./hardware/esp32_firmware/upload.sh
```

## Pinout

| Component        | GPIO | Notes                    |
|-----------------|------|--------------------------|
| ZMPT101B (V)    | D34  | ADC1_6                   |
| ACS712 (I)      | D35  | ADC1_7                   |
| Relay           | D26  | Drives load (e.g. 2W LED)|
| Buzzer          | D25  | Optional                 |
| Red LED         | D12  | Status                   |
| Blue LED        | D13  | Status                   |
| I2C 16×2 LCD    | D21 (SDA), D22 (SCL) | Default I2C   |

## Smart meter behavior

- **LCD Page 1:** Voltage, current, and health state.
- **LCD Page 2:** Power and accumulated energy in Wh.
- **LCD Page 3:** AP IP, connected station count, and relay state.
- **Blue LED:** healthy / connected / no-load state.
- **Red LED:** alert state (overcurrent or abnormal voltage).
- **Buzzer:** chirps when the meter enters alert state.
- **AP mode:** the ESP32 creates a hotspot named `FedGrid-Node1`.
- **Wi‑Fi reporting:** posts `node_id=1`, voltage, current, power, energy, status, relay state, and RSSI to the FedGrid hardware listener.
- **Website relay control:** the dashboard can queue a relay ON/OFF command, and the ESP32 applies it on the next successful sync.

## Wiring

- **ZMPT101B**: Output → D34; Vcc → 3.3V or 5V (check module); GND → GND. Measure AC mains via terminal (isolated).
- **ACS712**: Vout → D35; Vcc → 5V recommended (or 3.3V with divider); GND → GND. Load (e.g. 2W LED) in series through the sensor.
- **Relay**: IN → D26; Vcc/GND to module. Use relay to switch the 2W LED so you can turn load on/off.
- **I2C LCD**: SDA → D21, SCL → D22, Vcc → 5V (or 3.3V if module allows), GND → GND. Most 16×2 I2C use address **0x27** or **0x3F**.

## Arduino IDE

1. Install **ESP32** board support (Board Manager → “esp32” by Espressif).
2. Install **LiquidCrystal I2C**: Sketch → Include Library → Manage Libraries → search “LiquidCrystal I2C” → install **LiquidCrystal I2C** by Frank de Brabander.
3. Open `FedGrid_Meter/FedGrid_Meter.ino`, select board **ESP32 Dev Module**, set port, then Upload.

## I2C address

If the LCD stays blank, try the other address in the sketch:

```cpp
LiquidCrystal_I2C lcd(0x27, 16, 2);  // or 0x3F
```

Scan with a small I2C scanner sketch if needed.

## Calibration

- **Voltage**: With a known AC voltage (e.g. multimeter), adjust `VOLTAGE_CAL` in the sketch until the LCD matches. Typical range 80–120 for 230 V AC.
- **Current**: With no load, current should sit near zero. Use a known load and tune `CURRENT_CAL` until the LCD and dashboard current value match your meter reading.
- **ACS712 variant**: 5A → 185 mV/A (default); 20A → 100 mV/A; 30A → 66 mV/A. Set `ACS712_MV_PER_A` accordingly.

## Configure Wi‑Fi / AP reporting

Edit either:

- `hardware/esp32_firmware/src/main.cpp`
- `hardware/esp32_firmware/FedGrid_Meter/FedGrid_Meter.ino`

Set:

```cpp
const bool USE_AP_MODE = true;
const char AP_SSID[] = "FedGrid-Node1";
const char AP_PASSWORD[] = "fedgrid123";
const char LISTENER_URL[] = "http://192.168.4.2:5002/data";
```

In AP mode, connect the laptop/PC to `FedGrid-Node1`. The ESP32 keeps `192.168.4.1`, and the first connected laptop usually gets `192.168.4.2`, which is why the listener URL points there by default.

## Show Node 1 on the local website

1. Flash the ESP32 and power it on. It will create the hotspot `FedGrid-Node1`.

2. Connect your laptop to that hotspot.

3. Start the hardware listener on the laptop:

```bash
python3 -m hardware.hardware_listener
```

4. Start the main FedGrid backend in hardware mode:

```bash
export FEDGRID_MODE=hardware
python3 -m backend.server
```

5. Start the dashboard:

```bash
npm run dev
```

6. Open the local website and switch to the hardware view.
7. Use the `Relay ON` / `Relay OFF` buttons on the Node 1 card to control the relay from the site.

When the ESP32 is on the same Wi‑Fi network and posting successfully, **Node 1** will appear on the dashboard with voltage, current, power, status, relay state, and Wi‑Fi signal strength.

## 2W LED

- Connect the 2W LED (via relay) so the load current passes through the ACS712. Turn the relay **ON** (e.g. set `digitalWrite(PIN_RELAY, HIGH)` in `loop()` or add a button) to see current on the LCD. Line 1 = voltage, line 2 = current.

## Notes

- `RELAY_ACTIVE_HIGH` and `RELAY_DEFAULT_ON` are configurable in the firmware because relay modules differ.
- `AUTO_TRIP_RELAY` is disabled by default; enable it only after validating your wiring and thresholds.
- If the LCD stays blank, try I2C address `0x3F` instead of `0x27`.
