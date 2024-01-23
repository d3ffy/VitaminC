#include <Arduino.h>
#include <WiFi.h>

#define S2 0 /*Define S2 Pin Number of ESP32*/
#define S3 4 /*Define S3 Pin Number of ESP32*/
#define sensorOut 16 /*Define Sensor Output Pin Number of ESP32*/
#define PIN_RED    23 // GPIO23
#define PIN_GREEN  22 // GPIO22
#define PIN_BLUE   21 // GPIO21

#define ssid  "deffy's room"
#define pass  "FreeWifi"

/*Define int variables*/
int Red = 0;
int Green = 0;
int Blue = 0;
int Frequency = 0;

void setup() {
  pinMode(S2, OUTPUT); /*Define S2 Pin as a OUTPUT*/
  pinMode(S3, OUTPUT); /*Define S3 Pin as a OUTPUT*/
  pinMode(sensorOut, INPUT); /*Define Sensor Output Pin as a INPUT*/
  Serial.begin(115200); /*Set the baudrate to 115200*/
  Serial.println("This is TCS3200 Calibration Code");

  pinMode(PIN_RED,   OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE,  OUTPUT);

  // Wifi Setup
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}

void loop() {
  Red = getRed();
  delay(200); /*wait a 200mS*/
  Green = getGreen();
  delay(200); /*wait a 200mS*/
  Blue = getBlue();
  delay(200); /*wait a 200mS*/
  Serial.print("Red Freq = ");
  Serial.print(Red); /*Print Red Color Value on Serial Monitor*/
  Serial.print("   ");
  Serial.print("Green Freq = ");
  Serial.print(Green); /*Print Green Color Value on Serial Monitor*/
  Serial.print("   ");
  Serial.print("Blue Freq = ");
  Serial.println(Blue); /*Print Blue Color Value on Serial Monitor*/

  // color code #00C9CC (R = 0,   G = 201, B = 204)
  analogWrite(PIN_RED,   0);
  analogWrite(PIN_GREEN, 0);
  analogWrite(PIN_BLUE,  256);

  // delay(1000); // keep the color 1 second

  // // color code #F7788A (R = 247, G = 120, B = 138)
  // analogWrite(PIN_RED,   0);
  // analogWrite(PIN_GREEN, 256);
  // analogWrite(PIN_BLUE,  0);

  // delay(1000); // keep the color 1 second

  // // color code #34A853 (R = 52,  G = 168, B = 83)
  // analogWrite(PIN_RED,   256);
  // analogWrite(PIN_GREEN, 0);
  // analogWrite(PIN_BLUE,  0);

  delay(1000); // keep the color 1 second
}

int getRed() {
  digitalWrite(S2,LOW);
  digitalWrite(S3,LOW);
  Frequency = pulseIn(sensorOut, LOW); /*Get the Red Color Frequency*/
  return Frequency;
}

int getGreen() {
  digitalWrite(S2,HIGH);
  digitalWrite(S3,HIGH);
  Frequency = pulseIn(sensorOut, LOW); /*Get the Green Color Frequency*/
  return Frequency;
}

int getBlue() {
  digitalWrite(S2,LOW);
  digitalWrite(S3,HIGH);
  Frequency = pulseIn(sensorOut, LOW); /*Get the Blue Color Frequency*/
  return Frequency;
}

