// Arduino
#include <Wire.h>
#include "Adafruit_TCS34725.h"

/* TCS Wiring
  5V -> VIN
  GND -> GND
  A4 -> SDA
  A5 -> SCL
  6 -> LED 
*/

#define blueLED 11
#define greenLED 12
#define redLED 13
#define sensorWhiteLED 6
#define waterPump 7

Adafruit_TCS34725 ColorSensor = Adafruit_TCS34725();

void setup() {
  // Setup GPIO pin modes and initialize Serial communication at 115200 baud rate.
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(blueLED, OUTPUT);
  pinMode(sensorWhiteLED, OUTPUT);
  pinMode(waterPump, OUTPUT);
  Serial.begin(115200);

  digitalWrite(waterPump, HIGH);  // Initially turn off the water pump.

  // Initialize the color sensor and check if it starts successfully.
  if (ColorSensor.begin()) {
    Serial.println("READY");
  } else {
    Serial.println("FAILED");
    while (1);  // Halt if sensor fails to initialize.
  }
}

void loop() {
  // Repeatedly check for and handle incoming serial messages.
  String receivedMessage;
  messageHandler(receivedMessage);
  functionHandler(receivedMessage);
}

void messageHandler(String& receivedMessage) {
  // Read a line of message from the Serial input until a newline character is found.
  if (Serial.available() > 0) {
    receivedMessage = Serial.readStringUntil('\n');
  }
}

void functionHandler(const String& receivedMessage) {
  // Execute actions based on the commands received via Serial.
  if (receivedMessage.startsWith("READ")) {
    pumpWater();        // Activate water pump.
    getColorValue();    // Measure and process color values.
  } else if (receivedMessage.startsWith("PUMP")) {
    pumpWater();        // Activate water pump only.
  }
}

void getColorValue() {
  // Measure RGB values using the color sensor and calculate nutrient concentrations.
  // If need White LED from sensor, use sensorWhiteLED
  uint8_t rawRedValue, rawGreenValue, rawBlueValue, rawClearValue;
  float redValue, greenValue, blueValue, clearValue;
  // digitalWrite(sensorWhiteLED, HIGH);
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
  turnWhiteLED(HIGH);
  delay(500);
  rawClearValue = ColorSensor.read16(TCS34725_CDATAL);
  delay(500);
  // digitalWrite(sensorWhiteLED, LOW);
  turnWhiteLED(LOW);

  // Convert Raw to RGB
  if (rawClearValue <= 0) {
    redValue = greenValue = blueValue = 0; // Set all to zero if clear value is zero
  } else {
    // Convert and normalize RGB values
    redValue = (float(rawRedValue) / rawClearValue) * 255.0;
    greenValue = (float(rawGreenValue) / rawClearValue) * 255.0;
    blueValue = (float(rawBlueValue) / rawClearValue) * 255.0;
  }

  float nitrogenValue = calBeerLambertLaw(blueValue, "BLUE");
  float phosphorusValue = calBeerLambertLaw(greenValue, "GREEN");
  float potassiumValue = calBeerLambertLaw(redValue, "RED");
                  
  if (Serial.availableForWrite() > 40) { // Check if serial buffer is full
    Serial.print(F("VALUE N="));
    Serial.print(nitrogenValue, 5); 
    Serial.print(F(" P="));
    Serial.print(phosphorusValue, 5); 
    Serial.print(F(" K="));
    Serial.println(potassiumValue, 5);
  } else {
    clearSerialBuffer();
  }
}

float getAbsorbanceCoefficient(const String& color) {
  if (color == "RED") return 0.05392; // KNO3 for Potassium
  else if (color == "GREEN") return 0.05498; // KH2PO4 for Phosphorus
  else if (color == "BLUE") return 0.08679; // KNO3 for Nitrogen
  else return 0;
}

float calBeerLambertLaw(float value, const String& color) {
  float maxVal = 140.0; // assume that max color is 140
  if (value <= 0 || value >= maxVal) { 
    return 0.0;
  }
  float length = 4.0; // Path length in cm
  float coefficient = getAbsorbanceCoefficient(color);
  float absorbance = log10(maxVal / value); 
  return absorbance / (length * coefficient);
}

void clearSerialBuffer() {
  // Clear the Serial buffer and notify user if it's full.
  Serial.println(F("ERROR: Serial buffer is full. Please wait & try again"));
  while (Serial.available() > 0) {
    Serial.read();  // Discard any remaining bytes in the buffer.
  }
  Serial.println(F("Buffer Clear!"));
}

void pumpWater() {
  // Activate the water pump for 10 seconds, then turn it off.
  digitalWrite(waterPump, LOW);
  delay(10000); 
  digitalWrite(waterPump, HIGH);
}

void turnWhiteLED(uint8_t state) {
  // Turn all RGB LEDs on or off based on the provided state.
  digitalWrite(redLED, state);
  delay(300);
  digitalWrite(greenLED, state);
  delay(300);
  digitalWrite(blueLED, state);
}
