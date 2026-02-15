#!/usr/bin/env python3
"""
Arduino Serial Reader - Reads data from Arduino R4 serial output
Parses the JSON data that Arduino prints to Serial Monitor
"""

import serial
import json
import re
import time
import http.server
import socketserver

SERIAL_PORT = '/dev/cu.usbmodem4827E2E04AC42'
SERIAL_BAUD = 115200
PROXY_PORT = 8080

# Store last known data
last_data = {
    "current": 0.0,
    "raw_adc": 0,
    "status": "NORMAL",
    "timestamp": 0
}

def read_arduino_data():
    """Read and parse data from Arduino serial output"""
    global last_data
    
    try:
        ser = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=1)
        time.sleep(0.5)
        
        # Read available data
        data = ser.read(ser.in_waiting).decode('utf-8', errors='ignore')
        ser.close()
        
        # Try to extract JSON from serial output
        # Arduino might print: {"current":2.5,"raw_adc":2048,"status":"NORMAL","timestamp":12345}
        json_match = re.search(r'\{[^}]+\}', data)
        if json_match:
            try:
                parsed = json.loads(json_match.group())
                last_data = parsed
                return parsed
            except:
                pass
        
        return last_data
        
    except Exception as e:
        print(f"Error reading serial: {e}")
        return last_data

class SerialProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/data':
            # Read data from Arduino via serial
            data = read_arduino_data()
            
            # Add current timestamp if missing
            if 'timestamp' not in data or data['timestamp'] == 0:
                data['timestamp'] = int(time.time() * 1000)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
            
            print(f"[{time.strftime('%H:%M:%S')}] ✅ Sent data: {json.dumps(data)}")
        else:
            self.send_error(404, "Not Found")
    
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()

def main():
    print("🔗 Serial-Based HTTP Proxy")
    print("==========================")
    print(f"Reading from: {SERIAL_PORT}")
    print(f"Proxy on: http://localhost:{PROXY_PORT}")
    print("")
    print("✅ Works without network connection!")
    print("Press Ctrl+C to stop")
    print("")
    
    try:
        with socketserver.TCPServer(("", PROXY_PORT), SerialProxyHandler) as httpd:
            print(f"✅ Server started")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ Stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
