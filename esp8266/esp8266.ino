#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>
// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

// WiFi Credentials as constants
const char* WIFI_SSID = "deffy's room";
const char* WIFI_PASS = "FreeWifi";

// Firebase Credentials and Configuration as constants
const char* API_KEY = "AIzaSyCPkTRiFpWFcjuJvAiOZCqoMXJN2Gvtzjc";
const char* DATABASE_URL = "https://vitaminc-4695a-default-rtdb.asia-southeast1.firebasedatabase.app/";
const char* PROJECT_ID = "vitaminc-4695a";
const char* USER_EMAIL = "test12@gmail.com";
const char* USER_PASSWORD = "123456";

// Define sensor's name for Firebase
const char* SENSOR_NAME = "sensor_lnwza";

// Define RTDB path
// /{uid}/SENSOR_NAME/COMMAND
String path_RTDB;

// Firebase objects as global to initialize once
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);

  // WiFi & Firebase Setup
  WiFi.mode(WIFI_STA);
  connectWiFi(); 
  connectFirebase();
  initRTDB();
}

void loop() {
  static String receivedMessage; // Use static to keep it between calls but avoid global scope

  while (WiFi.status() == WL_CONNECTED) {
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

  // Handling received message from Arduino
  if (receivedMessage.startsWith("VALUE")) {
    // Mapping the received message to the variables
    int nitrogen, phosphorus, potassium;
    sscanf(receivedMessage.c_str(), "VALUE N=%d P=%d K=%d", &nitrogen, &phosphorus, &potassium);

    // Sent value to Firebase
    sentValueToFirebase(nitrogen, phosphorus, potassium);
    
    // Change the command to NONE after sending the value
    if (Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "NONE")) {
      Serial.println(F("Changing command to NONE"));
    } else {
      Serial.println(fbdo.errorReason());
    }
    
  // Handling command request from user
  } else if (Firebase.RTDB.getString(&fbdo, path_RTDB + "/COMMAND")) {
      // Checking READ command
      if (fbdo.stringData() == "READ") {
        Serial.println(F("READ request"));
        // Avoiding multiple READ request
        if (Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "PROCESS")) {
          Serial.println(F("Changing command to PROCESS"));
        } else { 
          Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "ERROR");
          Serial.println(fbdo.errorReason()); 
          }
      // Checking CALIBRATE command
      } else if (fbdo.stringData() == "CALIBRATE") {
        Serial.println(F("CALIBRATE request"));

        if (Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "PROCESS")) {
          Serial.println(F("Changing command to PROCESS"));
        } else { 
          Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "ERROR");
          Serial.println(fbdo.errorReason()); 
          }
      }
  }
}

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print(F("Connecting to WiFi"));
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(F("."));
    delay(1000);
  }
  Serial.println();
  Serial.println(F("WiFi Connected"));
}

void connectFirebase() {
  // Setting up Firebase Database
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  if (!Firebase.ready()) {
    Serial.println(F("Connecting to Firebase"));
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  }
}

void sentValueToFirebase(const int& nitrogen, const int& phosphorus, const int& potassium) {
  // Sent value to RTDB
  if (Firebase.RTDB.setInt(&fbdo, path_RTDB + "/nitrogen", nitrogen) &&
      Firebase.RTDB.setInt(&fbdo, path_RTDB + "/phosphorus", phosphorus) &&
      Firebase.RTDB.setInt(&fbdo, path_RTDB + "/potassium", potassium)){
    Serial.println(F("Sent value to Firebase successfully."));
  } else {
    Serial.println(fbdo.errorReason());}
}

void initRTDB() {
  Serial.println(F("Initializing RTDB"));
  path_RTDB = "/" + String(auth.token.uid.c_str()) + "/";
  // Create RTDB path
  if (Firebase.RTDB.setString(&fbdo, path_RTDB + SENSOR_NAME + "/COMMAND", "NONE")) {
    // If success, change global RTDB path
    Serial.println(F("Initialize RTDB Successfully"));
    path_RTDB += String(SENSOR_NAME); 
  } else {
    Serial.println(fbdo.errorReason());
  }
}