# 🔌 Connect to ESP8266 Now

## Your FTDI Port is Ready!

**Detected Port:** `/dev/tty.usbserial-A5069RR4`

---

## 🚀 Connect in 3 Steps

### Step 1: Open Terminal

Open a new Terminal window (don't use this one if screen is running).

### Step 2: Navigate to Project

```bash
cd "/Users/mrstark/Desktop/Code PlayGround/FedGrid"
```

### Step 3: Run Connection Script

```bash
./connect_esp8266.sh
```

**OR manually:**

```bash
screen /dev/tty.usbserial-A5069RR4 115200
```

---

## ✅ What Should Happen

1. Terminal will connect to ESP8266
2. You'll see ESP8266 boot messages (if powered on)
3. If code is uploaded, you'll see:
   ```
   ========================================
   ESP8266 Smart Meter AP Started
   ========================================
   AP SSID: SmartMeter_Node1
   AP IP Address: 192.168.4.1
   ========================================
   HTTP server started
   ========================================
   ```

---

## 🎮 Controls

### Exit Screen:
```
Press: Ctrl+A
Then:  K
Then:  Y
```

---

## 🔧 If Nothing Appears

1. **Check ESP8266 is powered on**
2. **Verify wiring:**
   - FTDI GND → ESP8266 GND
   - FTDI TXD → ESP8266 RX
   - FTDI RXD → ESP8266 TX
3. **Check baud rate is 115200**
4. **Try pressing RESET button on ESP8266**

---

## 🧪 Test API (in another terminal)

While screen is running, open another terminal:

```bash
# Connect to ESP8266 Wi-Fi first
# Then test:
curl http://192.168.4.1/data
```

You should see JSON response and activity in the screen session!

---

**Ready? Run the command above in a new terminal!** 🚀
