#import serial
#
#SERIAL_PORT = "/dev/serial0"  # Raspberry Pi 4 jaoks
#BAUD_RATE = 9600
#

#def read_pm5003():
 #   try:
  #      ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
   #     while True:
    #        data = ser.read(32)  # PM5003 saadab 32-baidise paketi
     #       print(f"Saadud andmed: {data}")  # Prindi kõik andmed välja
      #      if len(data) == 32 and data[0] == 0x42 and data[1] == 0x4D:
       #         pm1_0 = (data[10] << 8) | data[11]
        #        pm2_5 = (data[12] << 8) | data[13]
         #       pm10  = (data[14] << 8) | data[15]
          #      print(f"PM1.0: {pm1_0} µg/m³, PM2.5: {pm2_5} µg/m³, PM10: {pm10} µg/m³")
           # else:
            #    print("Andmed ei olnud õiges formaadis.")
    #except serial.SerialException as e:
     #   print(f"Viga: {e}")
#
#if __name__ == "__main__":
#    read_pm5003()
#
import serial
import json
import sys

SERIAL_PORT = sys.argv[1] if len(sys.argv) > 1 else "/dev/serial0"
BAUD_RATE = 9600

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
    data = ser.read(32)
    if len(data) == 32 and data[0] == 0x42 and data[1] == 0x4D:
        pm1_0 = (data[10] << 8) | data[11]
        pm2_5 = (data[12] << 8) | data[13]
        pm10  = (data[14] << 8) | data[15]
        output = {
            "pm1_0": pm1_0,
            "pm2_5": pm2_5,
            "pm10": pm10
        }
        print(json.dumps(output))
    else:
        print(json.dumps({"error": "Invalid data"}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
