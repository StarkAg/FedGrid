# 📡 ESP8266 Wi-Fi Station Mode Setup

## ✅ Code Updated!

ESP8266 is now configured to connect to your Wi-Fi network instead of creating its own AP.

---

## 🔧 Wi-Fi Credentials

**SSID:** `Airtel__ontopp`  
**Password:** `estancia3071`

---

## 📤 Upload Updated Code

```bash
./upload_esp8266.sh
```

---

## 📡 Get ESP8266 IP Address

After upload, **check Serial Monitor** to see the assigned IP:

1. **Connect to ESP8266 via Serial:**
   ```bash
   ./monitor_esp8266.sh
   ```

2. **Look for this output:**
   ```
   ✅ Connected to Wi-Fi!
   IP Address: 192.168.1.XXX  ← This is your ESP8266 IP
   Endpoint: http://192.168.1.XXX/data
   ```

3. **Copy the IP address** (e.g., `192.168.1.105`)

---

## 🔄 Update Dashboard Config

1. **Open:** `config/esp8266.ts`

2. **Update the IP:**
   ```typescript
   export const ESP8266_IP = '192.168.1.105'; // ← Your ESP8266 IP
   ```

3. **Restart dashboard:**
   ```bash
   # Stop current dashboard (Ctrl+C)
   npm run dev
   ```

---

## ✅ Test Connection

1. **Make sure you're on the same Wi-Fi network** (`Airtel__ontopp`)

2. **Open dashboard:** `http://localhost:3000`

3. **Should see:**
   - ✅ "Live" status badge
   - ✅ Real-time data updates
   - ✅ Chart showing readings

---

## 🔍 Troubleshooting

### Can't see IP in Serial Monitor?
- Press **RESET** button on ESP8266
- Wait for connection messages
- Look for "IP Address: ..."

### Dashboard shows "Offline"?
- Check ESP8266 IP is correct in `config/esp8266.ts`
- Make sure you're on same Wi-Fi network
- Check Serial Monitor - ESP8266 should show "Connected to Wi-Fi!"

### ESP8266 won't connect?
- Verify Wi-Fi SSID: `Airtel__ontopp` (exact match, case-sensitive)
- Verify password: `estancia3071`
- Check router is working
- Check Serial Monitor for error messages

---

## 📝 Quick Steps

1. ✅ Upload code: `./upload_esp8266.sh`
2. ✅ Check Serial: `./monitor_esp8266.sh` → Get IP
3. ✅ Update config: `config/esp8266.ts` → Set IP
4. ✅ Restart dashboard: `npm run dev`
5. ✅ Open: `http://localhost:3000`

---

**After upload, check Serial Monitor for the IP address!** 📡
