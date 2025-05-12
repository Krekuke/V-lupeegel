#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

import time
import board
import adafruit_bme680
import json

# Loo sensori objekt, kasutades kaardi vaikimisi I2C bussi
i2c = board.I2C()  # I2C protokoll
bme680 = adafruit_bme680.Adafruit_BME680_I2C(i2c, debug=False)  # veateated on keelatud

# Temperatuuri tasakaalu korrigeerimine, ühik on kraadides
temperature_offset = -5

# Andmete lugemine ja vormindamine
temperature = bme680.temperature + temperature_offset
humidity = bme680.relative_humidity

# Loome sõnastiku, mille teisendame JSON-iks
data = {
    "temperature": round(temperature, 1),  # Üks komakoht
    "humidity": round(humidity, 0)  # Täisarv
}

# Muudame sõnastiku JSON-iks ja tagastame
json_data = json.dumps(data)
print(json_data)  # Tagastame JSON-vormingus andmed

time.sleep(1)
