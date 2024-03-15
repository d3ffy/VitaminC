#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>

// Define WiFi Component
#define WIFI_SSID "deffy's room"
#define WIFI_PASS "FreeWifi"

// Define Buffer Size
const byte BUFFER_SIZE = 16;
char receivedMessage[BUFFER_SIZE];
byte messageIndex = 0;

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

// Define Pin Number
const byte LED = 13;

void setup() {
  Serial.begin(9600);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  } else {
    messageHandler();
    functionHandler();
    clearMessage();
    delay(1000);
    digitalWrite(LED, LOW);  
  }
}

void messageHandler() {
  while (Serial.available() > 0) {
    char receivedChar = Serial.read();
    if (receivedChar == '\n') {
      messageIndex = 0;
      break;
    } else {
      receivedMessage[messageIndex++] = receivedChar;
    }
    delay(100);
  }
}

void functionHandler() {
  // use strncmp for handling future complicate function
  if (strncmp(receivedMessage, "RED", 3) == 0) {
    Serial.println("Blink red color");
    digitalWrite(LED, HIGH);
  } else if (strncmp(receivedMessage, "GREEN", 5) == 0) {
    Serial.println("Blink green color");
  } else if (strncmp(receivedMessage, "BLUE", 4) == 0) {
    Serial.println("Blink blue color");
  } else if(receivedMessage != NULL){
    Serial.print("Received: ");
    Serial.println(receivedMessage);
  }
}

void clearMessage() {
  for (uint8_t i = 0; i < BUFFER_SIZE; i++) {
  	receivedMessage[i] = '\0';
  }
}

void connectWiFi() {
  WiFi.mode(WIFI_STA); // Set ESP to Station Mode
  WiFi.begin(WIFI_SSID, WIFI_PASS); // Connect to WiFi
  Serial.print("Connecting to WiFi");

  // loop until ESP connected to WiFi
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println();
  Serial.print("Connected to IP Address: ");
  Serial.println(WiFi.localIP()); // Annouce Local IP
}