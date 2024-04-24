// Arduino
#include <Wire.h>
#include "Adafruit_TCS34725.h"

/* TCS Wiring
  5V -> VIN
  GND -> GND
  A4 -> SDA
  A5 -> SCL
  LED -> 6
*/

#define blueLED 11
#define greenLED 12
#define redLED 13
#define sensorWhiteLED 6
#define waterPump 7

Adafruit_TCS34725 ColorSensor = Adafruit_TCS34725();

void setup() {
  // Pin define
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(blueLED, OUTPUT);
  pinMode(sensorWhiteLED, OUTPUT);
  pinMode(waterPump, OUTPUT);
  Serial.begin(115200);

  digitalWrite(waterPump, HIGH);

  if (ColorSensor.begin()) {
    Serial.println("READY");
    } else {
    Serial.println("FAILED");
    while (1);
  }
}

void loop() {
  String receivedMessage;
  messageHandler(receivedMessage);
  functionHandler(receivedMessage);
}

void messageHandler(String& receivedMessage) {
  if (Serial.available() > 0) {
    receivedMessage = Serial.readStringUntil('\n');
  }
}

void functionHandler(const String& receivedMessage) {
  if (receivedMessage.startsWith("READ")) {
    pumpWater();
    getColorValue();
  }
}

void getColorValue() {
  uint8_t rawRedValue, rawGreenValue, rawBlueValue, rawClearValue;
  float redValue, greenValue, blueValue, clearValue;
  digitalWrite(sensorWhiteLED, HIGH);
  delay(500);

  // Turn red LED & read RED value
  digitalWrite(redLED, HIGH);
  delay(500);
  rawRedValue = ColorSensor.read16(TCS34725_RDATAL);
  delay(500);
  digitalWrite(redLED, LOW);
  delay(500);

  // Turn green LED & read GREEN value
  digitalWrite(greenLED, HIGH);
  delay(500);
  rawGreenValue = ColorSensor.read16(TCS34725_GDATAL);
  delay(500);
  digitalWrite(greenLED, LOW);
  delay(500);

  // Turn blue LED & read BLUE value
  digitalWrite(blueLED, HIGH);
  delay(500);
  rawBlueValue = ColorSensor.read16(TCS34725_BDATAL);
  delay(500);
  digitalWrite(blueLED, LOW);
  delay(500);
  
  // Read Clear Value 
  // turnWhiteLED(HIGH);
  delay(500);
  rawClearValue = ColorSensor.read16(TCS34725_CDATAL);
  delay(500);
  digitalWrite(sensorWhiteLED, LOW);
  // turnWhiteLED(LOW);

  Serial.println(String(rawRedValue) + " " + String(rawGreenValue) + " " + String(rawBlueValue) + " " + String(rawClearValue)); // debuging raw values
  // Convert Raw to RGB
  if (rawClearValue <= 0) {
    redValue = greenValue = blueValue = 0; // Set all to zero if clear value is zero
  } else {
    // Convert and normalize RGB values
    redValue = (float(rawRedValue) / rawClearValue) * 255.0;
    greenValue = (float(rawGreenValue) / rawClearValue) * 255.0;
    blueValue = (float(rawBlueValue) / rawClearValue) * 255.0;
  }

  Serial.println(String(redValue) + " " + String(greenValue) + " " + String(blueValue)); // debuging rgb
  float nitrogenValue = calBeerLambertLaw(blueValue, "BLUE");
  float phosphorusValue = calBeerLambertLaw(greenValue, "GREEN");
  float potassiumValue = calBeerLambertLaw(redValue, "RED");
                  
  if (Serial.availableForWrite() > 50) { // Avoiding buffer overflow, maximum string = 50 characters
    Serial.print(F("VALUE N="));
    Serial.print(nitrogenValue, 4); 
    Serial.print(F(" P="));
    Serial.print(phosphorusValue, 4); 
    Serial.print(F(" K="));
    Serial.println(potassiumValue, 4);
    

  } else {
    Serial.println(F("ERROR: Serial buffer is full. Please wait & try again"));
    clearSerialBuffer();
  }
}

float getAbsorbanceCoefficient(const String& color) {
  if (color == "RED") return 0.0085;
  else if (color == "GREEN") return 0.0140;
  else if (color == "BLUE") return 0.005;
  else return 0;
}

float calBeerLambertLaw(float value, const String& color) {
  if (value <= 0 || value >= 255) {
    return 0.0;
  }
  float length = 1.0; // Path length in cm
  float coefficient = getAbsorbanceCoefficient(color);
  float absorbance = log10(255.0 / value);  // Assume Max color is 255
  return absorbance / (length * coefficient);
}

void clearSerialBuffer() {
  while (Serial.available() > 0) {
    Serial.read();
  }
}

void pumpWater() {
  digitalWrite(waterPump, LOW);
  delay(1000);
  digitalWrite(waterPump, HIGH);
}

void turnWhiteLED(uint8_t state) {
  digitalWrite(redLED, state);
  delay(300);
  digitalWrite(greenLED, state);
  delay(300);
  digitalWrite(blueLED, state);
  delay(300);
}
