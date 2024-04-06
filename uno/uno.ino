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

  // Calibrate lowest light
  Serial.println(F("Face Dark surface // turn off all light"));
  delay(1000);
  ColorSensor.calibrate_dark();
  delay(1000);

  // Calibrate highest light
  Serial.println(F("Face white surface // turn on all light"));
  delay(1000);
  ColorSensor.calibrate_light();
  delay(1000);

  // Calibrate the sensor from light/dark value
  ColorSensor.calibrate();
  delay(500);
  Serial.println(F("Calibration done"));
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
  int redValue = 0, greenValue = 0, blueValue = 0;
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
  
  String output = "VALUE N=" + String(redValue) 
                  + " P=" + String(greenValue) 
                  + " K=" + String(blueValue);
                  
  if (Serial.availableForWrite() > output.length() + 2) { // To ensure the buffer is not full & +2 is newline
    Serial.println(output);
  } else if (Serial.availableForWrite() <= output.length() + 2) {
    Serial.println(F("ERROR: Serial buffer is full. Please wait & try again"));
    Serial.read();
  }
}