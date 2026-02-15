# 📡 ESP8266 Wi-Fi Credentials

## Network Information

**SSID (Network Name):** `SmartMeter_Node1`

**Password:** `12345678`

---

## 🔌 How to Connect

### On Mac/iPhone:

1. **Open Wi-Fi settings**
2. **Look for:** `SmartMeter_Node1`
3. **Enter password:** `12345678`
4. **Connect**

---

## ✅ After Connecting

### Test API:
```
http://192.168.4.1/data
```

### Should return JSON:
```json
{"current":2.5,"raw_adc":512,"status":"NORMAL","timestamp":12345}
```

---

## 🔧 If Can't Connect

1. **Check ESP8266 is running:**
   - Monitor serial output
   - Should show "AP Started"

2. **Verify SSID:**
   - Should be exactly: `SmartMeter_Node1`

3. **Try forgetting network:**
   - Forget `SmartMeter_Node1` if previously connected
   - Reconnect with password

4. **Check distance:**
   - ESP8266 AP range is limited (~30-50 meters)
   - Stay close to ESP8266

---

## 📝 Quick Reference

```
Network: SmartMeter_Node1
Password: 12345678
IP: 192.168.4.1
API: http://192.168.4.1/data
```

---

**Password: `12345678`** 🔑
