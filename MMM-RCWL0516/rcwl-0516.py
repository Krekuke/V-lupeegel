import RPi.GPIO as GPIO
import time

# Kasutatav GPIO number (BCM süsteemis)
SENSOR_PIN = 14  # Vastab pin 8-le füüsilisel paigutusel

# GPIO moodi seadmine BCM-i järgi
GPIO.setmode(GPIO.BCM)

# Määrame sensori sisendiks
GPIO.setup(SENSOR_PIN, GPIO.IN)

try:
    print("🔍 Alustan liikumise tuvastamist...")

    # Salvestab eelmise seisundi, et vältida korduvat väljundit
    prev_state = None

    while True:
        # Loeb praeguse anduri väärtuse (1 = liikumine, 0 = ei liigu)
        motion = GPIO.input(SENSOR_PIN)

        # Kui seisund muutus, prindi tulemus
        if motion != prev_state:
            if motion:
                print("MOTION_DETECTED", flush=True)
            else:
                print("NO_MOTION", flush=True)
            prev_state = motion

        # Kontrollime iga 0.5 sekundi tagant
        time.sleep(0.5)

except KeyboardInterrupt:
    print("❌ Lõpetan.")
    GPIO.cleanup()
