#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>

// WiFi Credentials as constants
const char* WIFI_SSID = "deffy's room";
const char* WIFI_PASS = "FreeWifi";

// Firebase Credentials and Configuration as constants
const char* API_KEY = "AIzaSyCPkTRiFpWFcjuJvAiOZCqoMXJN2Gvtzjc";
const char* DATABASE_URL = "https://vitaminc-4695a-default-rtdb.asia-southeast1.firebasedatabase.app/";
const char* PROJECT_ID = "vitaminc-4695a";
const char* USER_EMAIL = "12345@gmail.com";
const char* USER_PASSWORD = "12345";

// Define sensor's name for Firebase
const char* SENSOR_NAME = "sensor-test";

// Define Pin Number as a constant
const byte redLED = 13;

// Firebase objects as global to initialize once
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(9600);
  pinMode(redLED, OUTPUT);

  // WiFi & Firebase Setup
  WiFi.mode(WIFI_STA);
  connectWiFi(); 
  connectFirebase();
}

void loop() {
  static String receivedMessage; // Use static to keep it between calls but avoid global scope

  while (WiFi.status() == WL_CONNECTED && Firebase.ready()) {
    messageHandler(receivedMessage);
    functionHandler(receivedMessage);
    receivedMessage = ""; // Clear the message
  }
  connectWiFi();
  connectFirebase();
}

void messageHandler(String& receivedMessage) {
  if (Serial.available() > 0) {
    receivedMessage = Serial.readStringUntil('\n');
  }
}

void functionHandler(const String& receivedMessage) {
  if (receivedMessage.startsWith("RED")) {
    Serial.println(F("Blink red color"));
    digitalWrite(redLED, HIGH);
  } else if (receivedMessage.startsWith("GREEN")) {
    Serial.println(F("Blink green color"));
  } else if (receivedMessage.startsWith("BLUE")) {
    Serial.println(F("Blink blue color"));
  } else if (receivedMessage.length() > 0) {
    Serial.print(F("Received: "));
    Serial.println(receivedMessage);
  }
}

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print(F("Connecting to WiFi"));
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println();
  Serial.print(F("Connected to: "));
  Serial.println(WiFi.localIP());
}

void connectFirebase() {
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  if (!Firebase.ready()) {
    Serial.println(F("Trying to connect to Firebase..."));
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  }
}

void sentColorToFirebase() {
  // Setting up the JSON object
  FirebaseJson json;
  json.set("sensor_name", SENSOR_NAME);
  json.set("email", USER_EMAIL);
  json.set("red", "int-red");
  json.set("blue", "int-blue");
  json.set("green", "int-green");

  String path = String("sensor_DB/") + SENSOR_NAME;
  if (Firebase.Firestore.createDocument(&fbdo, PROJECT_ID, "", path, json.raw())) {
    Serial.println(F("Create history success."));
  } else {
    Serial.println(fbdo.errorReason());
  }
}