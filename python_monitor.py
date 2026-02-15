#!/usr/bin/env python3
"""
Simple ESP8266 Serial Monitor using Python
Works when screen has PTY issues
"""

import serial
import sys
import glob

def find_serial_port():
    """Find ESP8266 serial port"""
    ports = glob.glob('/dev/cu.usbserial*') + glob.glob('/dev/tty.usbserial*')
    if ports:
        return ports[0]
    return None

def main():
    port = find_serial_port()
    if not port:
        print("❌ No serial port found!")
        print("Make sure ESP8266 is connected")
        sys.exit(1)
    
    print("📡 ESP8266 Serial Monitor")
    print("=" * 40)
    print(f"Port: {port}")
    print(f"Baud: 115200")
    print("")
    print("💡 Press Ctrl+C to exit")
    print("💡 Press RESET on ESP8266 to see boot messages")
    print("")
    print("-" * 40)
    print("")
    
    try:
        ser = serial.Serial(port, 115200, timeout=1)
        print("✅ Connected! Reading data...\n")
        
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8', errors='ignore')
                print(line, end='')
            else:
                import time
                time.sleep(0.1)
                
    except KeyboardInterrupt:
        print("\n\n✅ Exiting...")
    except serial.SerialException as e:
        print(f"\n❌ Serial error: {e}")
        print("\nTry:")
        print("  1. Check ESP8266 is connected")
        print("  2. Close other programs using the port")
        print("  3. Press RESET on ESP8266")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()

if __name__ == "__main__":
    main()
