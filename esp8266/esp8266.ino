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
const char* USER_EMAIL = "deffy@gmail.com";
const char* USER_PASSWORD = "123456";

// Define sensor's name for Firebase
const char* SENSOR_NAME = "sensor_baboo";

// Firebase objects as global to initialize once
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Define RTDB path
// /{uid}/SENSOR_NAME/COMMAND
String path_RTDB;

unsigned long lastFetch;
void setup() {
  Serial.begin(115200);

  // WiFi & Firebase Setup
  WiFi.mode(WIFI_STA);
  connectWiFi(); 
  connectFirebase();
  initRTDB();
  initFirestore();
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
    float nitrogen, phosphorus, potassium;
    sscanf(receivedMessage.c_str(), "VALUE N=%f P=%f K=%f", &nitrogen, &phosphorus, &potassium);

    // Sent value to Firebase
    sentValueToFirebase(nitrogen, phosphorus, potassium);
    
    // Change the command to NONE after sending the value
    if (Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "NONE")) {
      Serial.println(F("Changing command to NONE"));
    } else {
      Serial.println(fbdo.errorReason());
    }
    
  // Handling command request from user
  } else if (Firebase.RTDB.getString(&fbdo, path_RTDB + "/COMMAND") && millis() - lastFetch > 5000) {
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
      lastFetch = millis();

  } else if (receivedMessage.startsWith("ERROR")) {
    Serial.println(F("Error: please calibrate sensor and try again"));
    Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "ERROR");
    Serial.println(F("Changing command to ERROR"));
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

void sentValueToFirebase(const float& nitrogen, const float& phosphorus, const float& potassium) {
  // Sent value to RTDB
  if (Firebase.RTDB.setFloat(&fbdo, path_RTDB + "/nitrogen", nitrogen) &&
      Firebase.RTDB.setFloat(&fbdo, path_RTDB + "/phosphorus", phosphorus) &&
      Firebase.RTDB.setFloat(&fbdo, path_RTDB + "/potassium", potassium)){
    Serial.println(F("Sent value to RTDB successfully."));
  } else {
    Serial.println(fbdo.errorReason());}
}

void initRTDB() {
  Serial.println(F("Initializing RTDB"));
  path_RTDB += "/" + String(auth.token.uid.c_str()) + "/" + SENSOR_NAME;
  // Create RTDB path
  if (Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "NONE")) {
    Serial.println(F("Initialize RTDB Successfully"));
  } else {
    Serial.println(fbdo.errorReason());
  }
}

void initFirestore() {
  // Checking initialized name
  Serial.println(F("Initializing Firestore"));

  if (!checkSensorName()) {
    // If sensor name isn't initialized
    String path = "user_DB/" + String(auth.token.uid.c_str());
    FirebaseJson json;
    
    // Create email field
    json.set("fields/email/stringValue", USER_EMAIL);
    if (Firebase.Firestore.createDocument(&fbdo, PROJECT_ID, "", path, json.raw())) {
      json.clear();
      // Create sensor field
      path += "/sensor_DB";
      json.set("fields/name/stringValue", SENSOR_NAME);
      if (Firebase.Firestore.createDocument(&fbdo, PROJECT_ID, "", path, json.raw())) {
        Serial.println("Create Successfully");
      } else {
        Serial.println(fbdo.errorReason());
      }
    } else {
      Serial.println(fbdo.errorReason());
    }

  } else {
    Serial.println(F("Sensor name already initialzed!"));
  }
}

bool checkSensorName() {
  String path = "user_DB/" + String(auth.token.uid.c_str()) + "/sensor_DB";
  if (Firebase.Firestore.getDocument(&fbdo, PROJECT_ID, "", path, "name")) {
    FirebaseJson json;
    FirebaseJsonData jsonData;

    json.setJsonData(fbdo.payload().c_str());
    
    if (json.get(jsonData, "documents")) {
      
      for (uint8_t i = 0; i < 20; i++) {
        String jsonPath = "documents/[" + String(i) + "]/fields/name/stringValue";
        if (json.get(jsonData, jsonPath.c_str())) {
          if (!jsonData.stringValue.isEmpty()) {
            if (jsonData.stringValue.equalsIgnoreCase(SENSOR_NAME)) { 
              return true; // Match found, return true immediately
            }
          }
        }
      }
    }
  } else {
    Serial.println(fbdo.errorReason());
  }

  return false; // No match found, return false
}
