#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Define Pin Number
#define S2 0 
#define S3 4 
#define sensorOut 16 
#define PIN_RED    23 
#define PIN_GREEN  22 
#define PIN_BLUE   21 

// Define WiFi Component
#define WIFI_SSID "deffy's room"
#define WIFI_PASS "FreeWifi"

// Define Firebase Component
#define API_KEY "AIzaSyCPkTRiFpWFcjuJvAiOZCqoMXJN2Gvtzjc"
#define DATABASE_URL "https://vitaminc-4695a-default-rtdb.asia-southeast1.firebasedatabase.app/"
//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;
unsigned long sendDataPrevMillis = 0;
int intValue;
float floatValue;

// Define int variables
int red = 0;
int green = 0;
int blue = 0;
int frequency = 0;

void setup() {
  pinMode(S2, OUTPUT); // Define S2 Pin as a OUTPUT
  pinMode(S3, OUTPUT); // Define S3 Pin as a OUTPUT
  pinMode(sensorOut, INPUT); // Define Sensor Output Pin as a INPUT
  Serial.begin(115200); // Set the baudrate

  Serial.println("NPK Reader Project with TCS3200");
  Serial.println("Develop by VitaminC Group for SF341 & CN334");

  pinMode(PIN_RED,   OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE,  OUTPUT);

  // Wifi Setup
  WiFi.mode(WIFI_STA); // Set ESP to Station Mode
  WiFi.begin(WIFI_SSID, WIFI_PASS); // Connect to WiFi
  Serial.print("Connecting to WiFi");

  // loop while ESP not connected to WiFi
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println();
  Serial.println(WiFi.localIP()); // Annouce Local IP

  // Firebase Setup
  config.api_key = API_KEY; // Assign the api key (required)
  config.database_url = DATABASE_URL; // Assign the RTDB URL (required)
  
  // Sign up as annonymous
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("Connected to Firebase!");
    signupOK = true;
  }
  else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  red = getRed();
  delay(200); 
  green = getGreen();
  delay(200); 
  blue = getBlue();
  delay(200); 
  Serial.print("Red Freq = ");
  Serial.print(red); 
  Serial.print("   ");
  Serial.print("Green Freq = ");
  Serial.print(green); 
  Serial.print("   ");
  Serial.print("Blue Freq = ");
  Serial.println(blue); 

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

  // Send Value to Firebase
  sendColorToFirebase("test/red", red);
  sendColorToFirebase("test/green", green);
  sendColorToFirebase("test/blue", blue);
  delay(5000);
}

int getRed() {
  digitalWrite(S2,LOW);
  digitalWrite(S3,LOW);
  frequency = pulseIn(sensorOut, LOW); // Get the Red Color Frequency
  return frequency;
}

int getGreen() {
  digitalWrite(S2,HIGH);
  digitalWrite(S3,HIGH);
  frequency = pulseIn(sensorOut, LOW); // Get the Green Color Frequency
  return frequency;
}

int getBlue() {
  digitalWrite(S2,LOW);
  digitalWrite(S3,HIGH);
  frequency = pulseIn(sensorOut, LOW); // Get the Blue Color Frequency
  return frequency;
}

void sendColorToFirebase(const char* colorPath, int colorValue) {
  String msg = String(colorValue) + " was sent for " + String(colorPath);
  if (Firebase.RTDB.setInt(&fbdo, colorPath, colorValue)) {
    Serial.println(msg);
  } else {
    Serial.println(fbdo.errorReason());
  }
}