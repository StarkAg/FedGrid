# ESP8266 API Reference

This document describes the expected API format for the ESP8266 smart meter.

## Endpoint

```
GET http://192.168.4.1/data
```

## Response Format

The ESP8266 should return a JSON object with the following structure:

```json
{
  "current": 3.6,
  "raw_adc": 2870,
  "status": "PEAK",
  "timestamp": 123456
}
```

### Field Descriptions

- **current** (float): Current load in Amperes (A)
  - Example: `3.6` means 3.6 Amperes
  
- **raw_adc** (integer): Raw ADC reading from the potentiometer
  - Example: `2870` (0-4095 range for 12-bit ADC)
  
- **status** (string): Load status indicator
  - Values: `"NORMAL"` or `"PEAK"`
  - `"PEAK"` when current > 3.0 A
  - `"NORMAL"` when current ≤ 3.0 A
  
- **timestamp** (integer): Unix timestamp in milliseconds
  - Example: `123456` (milliseconds since epoch)

## CORS Headers

To avoid CORS issues, the ESP8266 should send these headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Complete ESP8266 Code

The complete, ready-to-use ESP8266 code is available in `ESP8266_SmartMeter.ino`.

**Key Features:**
- ✅ AP mode (creates its own Wi-Fi network)
- ✅ CORS headers included (works with Next.js dashboard)
- ✅ Potentiometer reading (A0 pin)
- ✅ Real-time JSON API at `/data`
- ✅ Status calculation (NORMAL/PEAK based on threshold)

**Hardware Connection:**
- Potentiometer VCC → ESP8266 3.3V
- Potentiometer GND → ESP8266 GND
- Potentiometer Wiper (middle) → ESP8266 A0

**To Use:**
1. Open `ESP8266_SmartMeter.ino` in Arduino IDE
2. Select your ESP8266 board and port
3. Upload the code
4. Open Serial Monitor (115200 baud) to see AP IP address
5. Connect device to Wi-Fi network: `SmartMeter_Node1` (password: `12345678`)
6. Test API: `http://192.168.4.1/data`

## Testing

You can test the API directly in a browser or using curl:

```bash
curl http://192.168.4.1/data
```

Expected response:
```json
{"current":2.5,"raw_adc":2048,"status":"NORMAL","timestamp":123456}
```
