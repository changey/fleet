from __future__ import print_function
import json
import csv
import random
import string
from random import randint

outputJson = open('cars.json', 'w')

output = []
models = [
    {"make": "Tesla",
     "model": "Model S"},
    {"make": "Toyota",
     "model": "Prius"},
    {"make": "Nissan",
     "model": "Leaf"},
    {"make": "Nissan",
     "model": "Sentra"},
    {"make": "Honda",
     "model": "Civic"},
    {"make": "Honda",
     "model": "Accord"}
]

for i in range(0, 100):
    randomInt = randint(0, 5)
    car = {}
    car['make'] = models[randomInt]["make"]
    car['model'] = models[randomInt]["model"]
    if i < 82:
        car['state'] = "O"
    elif i >= 82 and i < 86:
        car['state'] = "OP"
    elif i >= 86 and i < 98:
        car['state'] = "U"
    else:
        car['state'] = "UP"
    plateNum = ""
    for i in range(0, 7):
        randomInt2 = randint(0, 2)
        if randomInt2 == 0:
            plateNum += str(randint(0, 9))
        else:
            plateNum += random.choice(string.ascii_uppercase[0:25])
    car['platNum'] = plateNum
    output.append(car)
    print(car)

outputJson.write(json.dumps(output, sort_keys=True, indent=2))

outputJson.close()
