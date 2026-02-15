#!/usr/bin/env python3
"""
Simple Serial Proxy - Reads Arduino serial output and serves via HTTP
No code changes needed - just reads what Arduino already prints!
"""

import serial
import json
import re
import time
import http.server
import socketserver
import sys

SERIAL_PORT = '/dev/cu.usbmodem4827E2E04AC42'
SERIAL_BAUD = 115200
PROXY_PORT = 8080

# Store last known values
last_data = {
    "current": 2.5,
    "raw_adc": 2048,
    "status": "NORMAL",
    "timestamp": int(time.time() * 1000)
}

def read_serial_data():
    """Read data from Arduino serial output"""
    global last_data
    
    try:
        ser = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=1)
        time.sleep(0.2)
        
        # Read available data
        if ser.in_waiting > 0:
            data = ser.read(ser.in_waiting).decode('utf-8', errors='ignore')
            
            # Try to extract current value from serial output
            # Look for patterns like "current: 2.5" or "Current: 2.5"
            current_match = re.search(r'[Cc]urrent[:\s]+([\d.]+)', data)
            if current_match:
                last_data["current"] = float(current_match.group(1))
            
            # Look for raw_adc
            adc_match = re.search(r'[Rr]aw[_\s]*[Aa][Dd][Cc][:\s]+(\d+)', data)
            if adc_match:
                last_data["raw_adc"] = int(adc_match.group(1))
            
            # Look for status
            if 'PEAK' in data.upper():
                last_data["status"] = "PEAK"
            elif 'NORMAL' in data.upper():
                last_data["status"] = "NORMAL"
            
            # Update timestamp
            last_data["timestamp"] = int(time.time() * 1000)
        
        ser.close()
        
    except serial.SerialException:
        # Port might be busy, use last known data
        pass
    except Exception as e:
        print(f"Error: {e}")
    
    return last_data

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/data':
            # Read data from serial
            data = read_serial_data()
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
            
            print(f"[{time.strftime('%H:%M:%S')}] ✅ Sent: {json.dumps(data)}")
        else:
            self.send_error(404, "Not Found")
    
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

def main():
    print("🔗 Simple Serial HTTP Proxy")
    print("============================")
    print(f"Serial: {SERIAL_PORT}")
    print(f"Proxy: http://localhost:{PROXY_PORT}")
    print("")
    print("📡 Reading Arduino serial output")
    print("🌐 Serving on: http://localhost:{PROXY_PORT}/data")
    print("")
    print("✅ No network needed!")
    print("Press Ctrl+C to stop")
    print("")
    
    try:
        with socketserver.TCPServer(("", PROXY_PORT), ProxyHandler) as httpd:
            print(f"✅ Server started")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ Stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
