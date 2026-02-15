#!/usr/bin/env python3
"""
Serial Proxy - Forward HTTP requests from Mac to Arduino R4 via Serial
This allows connection even when on different networks
"""

import serial
import http.server
import socketserver
import urllib.request
import json
import sys
import time

SERIAL_PORT = '/dev/cu.usbmodem4827E2E04AC42'
SERIAL_BAUD = 115200
PROXY_PORT = 8080

class SerialProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/data':
            try:
                # Read data from Arduino R4 via serial
                ser = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=2)
                
                # Send request command via serial
                ser.write(b"GET_DATA\n")
                time.sleep(0.5)
                
                # Read response
                response = ser.readline().decode('utf-8', errors='ignore').strip()
                ser.close()
                
                # Parse and send JSON
                if response:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response.encode())
                else:
                    self.send_error(500, "No data from Arduino")
            except Exception as e:
                self.send_error(500, f"Serial error: {str(e)}")
        else:
            self.send_error(404, "Not Found")
    
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()

def main():
    print(f"🔗 Serial Proxy Server")
    print(f"======================")
    print(f"Serial Port: {SERIAL_PORT}")
    print(f"Proxy Port: {PROXY_PORT}")
    print(f"")
    print(f"📡 Forwarding requests to Arduino R4 via Serial")
    print(f"🌐 Access via: http://localhost:{PROXY_PORT}/data")
    print(f"")
    print(f"Press Ctrl+C to stop")
    print(f"")
    
    try:
        with socketserver.TCPServer(("", PROXY_PORT), SerialProxyHandler) as httpd:
            print(f"✅ Server started on port {PROXY_PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
