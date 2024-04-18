// Arduino
#include <N3200.h>

#define blueLED 11
#define greenLED 12
#define redLED 13
#define whiteLED 2

#define S0 3
#define S1 4
#define S2 6
#define S3 7
#define out 5

N3200 ColorSensor(S0, S1, S2, S3, out);
void setup() {
  // Pin define
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(blueLED, OUTPUT);
  pinMode(whiteLED, OUTPUT);
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(out, INPUT);
  Serial.begin(115200);

  // Color Sensor Setup
  ColorSensor.begin();
  ColorSensor.frequency_scaling(LO);
  calibrateSensor();
}

void loop() {
  String receivedMessage;
  messageHandler(receivedMessage);
  functionHandler(receivedMessage);
}

void calibrateSensor() {
  // Color Sensor Calibration
  Serial.println(F("Calibrating the sensor. . ."));
  delay(1000);

  // Calibrate lowest light
  Serial.println(F("Face Dark surface // turn off all light"));
  delay(2000);
  ColorSensor.calibrate_dark();
  delay(1000);

  // Calibrate highest light
  digitalWrite(whiteLED, HIGH);
  Serial.println(F("Face white surface // turn on all light"));
  delay(2000);
  ColorSensor.calibrate_light();
  delay(1000);
  digitalWrite(whiteLED, LOW);

  // Calibrate the sensor from light/dark value
  ColorSensor.calibrate();
  delay(500);
  digitalWrite(greenLED, HIGH);
  Serial.println(F("Calibration done"));
  delay(500);
  digitalWrite(greenLED, LOW);
}

void messageHandler(String& receivedMessage) {
  if (Serial.available() > 0) {
    receivedMessage = Serial.readStringUntil('\n');
  }
}

void functionHandler(const String& receivedMessage) {
  if (receivedMessage.startsWith("READ")) {
    getColorValue();
  } else if (receivedMessage.startsWith("CALIBRATE")) {
    calibrateSensor();
  }
}

void getColorValue() {
  uint8_t redValue = 0, greenValue = 0, blueValue = 0;
  // Turn red LED & read RED value
  digitalWrite(redLED, HIGH);
  delay(500);
  redValue = ColorSensor.read(RED);
  delay(500);
  digitalWrite(redLED, LOW);
  delay(500);
  // Turn green LED & read GREEN value
  digitalWrite(greenLED, HIGH);
  delay(500);
  greenValue = ColorSensor.read(GREEN);
  delay(500);
  digitalWrite(greenLED, LOW);
  delay(500);
  // Turn blue LED & read BLUE value
  digitalWrite(blueLED, HIGH);
  delay(500);
  blueValue = ColorSensor.read(BLUE); 
  delay(500);
  digitalWrite(blueLED, LOW);

  Serial.println(String(redValue) + " " + String(greenValue) + " " + String(blueValue)); // debug raw rgb
  float nitrogenValue = calBeerLambertLaw(blueValue, "BLUE");
  float phosphorusValue = calBeerLambertLaw(greenValue, "GREEN");
  float potassiumValue = calBeerLambertLaw(redValue, "RED");
                  
  if (Serial.availableForWrite() > 0) { 
    Serial.print(F("VALUE N="));
    Serial.print(nitrogenValue, 4); 
    Serial.print(F(" P="));
    Serial.print(phosphorusValue, 4); 
    Serial.print(F(" K="));
    Serial.println(potassiumValue, 4);

  } else if (Serial.availableForWrite() <= 0) {
    Serial.println(F("ERROR: Serial buffer is full. Please wait & try again"));
    Serial.read();
  }
}

float calBeerLambertLaw(uint8_t value, String color) {
  if (value <= 0 || value > 255) {
    Serial.println("ERROR: value must be between 0-255");
    return 0.0;
  }
  float length = 1.0; // Assume the path length is 1 cm
  float absorbance = log10(255.0 / value);  // Ensure floating point division

  // Calculate the concentration based on the color
  float coefficient;
  if (color == "RED") {
    coefficient = 0.0085; // Update with correct coefficient for RED
  } else if (color == "GREEN") {
    coefficient = 0.0140; // Update with correct coefficient for GREEN
  } else if (color == "BLUE") {
    coefficient = 0.005; // Update with correct coefficient for BLUE
  } else {
    Serial.println(F("ERROR: color not found"));
    return 0.0;
  }

  float concentration = absorbance / (length * coefficient);
  return concentration;
}
