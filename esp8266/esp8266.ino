#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

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

// timeClient to get current time from NTP server
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);
uint8_t SCHEDULE_HOUR = 12; // Set the scheduled hour in UTC+7

unsigned long lastFetch;
void setup() {
  Serial.begin(115200);

  // WiFi & Firebase Setup
  WiFi.mode(WIFI_STA);
  connectWiFi(); 
  connectFirebase();
  initRTDB();
  initFirestore();

  // Time Setup
  timeClient.begin();
  timeClient.update();
}

void loop() {
  static String receivedMessage; // Use static to keep it between calls but avoid global scope

  while (WiFi.status() == WL_CONNECTED) {
    timeClient.update();
    if (isScheduled()) {
      // Sent Command to Arduino
      Serial.println(F("Schedule time"));
      Serial.println(F("READ"));
      delay(50 * 1000); // Delay 50 second for avioding multiple request
    }
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
    sentValueToRTDB(nitrogen, phosphorus, potassium);
    if (isScheduled()) {
      // Sent value to Firestore
      sentValuetoFirestore(nitrogen, phosphorus, potassium);
      delay(50 * 1000); // Delay 50 second for avioding multiple request
    }
    
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

void sentValueToRTDB(const float& nitrogen, const float& phosphorus, const float& potassium) {
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
    Serial.println(F("Firestore initialzed!"));
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

String formatISO8601Timestamp() {
    timeClient.update();
    unsigned long epochTime = timeClient.getEpochTime();
    struct tm *ptm = gmtime((time_t *)&epochTime);  // Get UTC time structure

    char timestamp[30];
    sprintf(timestamp, "%04d-%02d-%02dT%02d:%02d:%02dZ", 
            ptm->tm_year + 1900, ptm->tm_mon + 1, ptm->tm_mday, 
            ptm->tm_hour, ptm->tm_min, ptm->tm_sec);

    return String(timestamp);
}

String getSensorDocumentId() {
  String path = "user_DB/" + String(auth.token.uid.c_str()) + "/sensor_DB";
  if (Firebase.Firestore.getDocument(&fbdo, PROJECT_ID, "", path, "name")) {
    FirebaseJson json;
    FirebaseJsonData jsonData;
    json.setJsonData(fbdo.payload().c_str());

    // Find the document ID with the sensor name
    if (json.get(jsonData, "documents")) {
      for (uint8_t i = 0; i < 20; i++) {
        String jsonPath = "documents/[" + String(i) + "]/fields/name/stringValue";
        if (json.get(jsonData, jsonPath.c_str())) {
          if (!jsonData.stringValue.isEmpty() && jsonData.stringValue.equalsIgnoreCase(SENSOR_NAME)) {
            // Get full document path
            String docIdPath = "documents/[" + String(i) + "]/name";
            if (json.get(jsonData, docIdPath.c_str())) {
              // Extract document ID from the full path
              String fullPath = jsonData.stringValue;
              int lastSlashIndex = fullPath.lastIndexOf('/');
              if (lastSlashIndex != -1) {
                return fullPath.substring(lastSlashIndex + 1); // Return the document ID
              }
            }
          }
        }
      }
    }
  } else {
    Serial.println(fbdo.errorReason());
  }

  return ""; // Return empty if no match found
}

void sentValuetoFirestore(const float& nitrogen, const float& phosphorus, const float& potassium) {
  // Get sensor document ID
  String sensorDocId = getSensorDocumentId();
  if (sensorDocId.isEmpty()) {
    Serial.println(F("Sensor document ID not found"));
    return;
  }
  // Find the plot_DB document ID
  String path = "user_DB/" + String(auth.token.uid.c_str()) + "/plot_DB";
  if (Firebase.Firestore.getDocument(&fbdo, PROJECT_ID, "", path, "sensor")) {
    FirebaseJson json;
    FirebaseJsonData jsonData;

    json.setJsonData(fbdo.payload().c_str());
    
    if (json.get(jsonData, "documents")) {
      for (uint8_t i = 0; i < 20; i++) { 
        String jsonPath = "documents/[" + String(i) + "]/fields/sensor/stringValue";
        if (json.get(jsonData, jsonPath.c_str())) {
          // check field name == sensorDocId
          if (!jsonData.stringValue.isEmpty() && jsonData.stringValue.equalsIgnoreCase(sensorDocId)) {
            // Get full document path
            String docIdPath = "documents/[" + String(i) + "]/name";
            if (json.get(jsonData, docIdPath.c_str())) {
              String fullPath = jsonData.stringValue;
              // Get only the document ID from plot_DB
              int lastSlashIndex = fullPath.lastIndexOf('/');
              if (lastSlashIndex != -1) {
                String plot_db_docId =  fullPath.substring(lastSlashIndex + 1); // Return the document ID

                // Setup path for new history record
                path += "/" + plot_db_docId + "/history_DB";
                FirebaseJson newHistoryData;
                String timestamp = formatISO8601Timestamp();
                newHistoryData.set("fields/NITROGEN/doubleValue", nitrogen);
                newHistoryData.set("fields/PHOSPHORUS/doubleValue", phosphorus);
                newHistoryData.set("fields/POTASSIUM/doubleValue", potassium);
                newHistoryData.set("fields/date/timestampValue", timestamp);
                if (Firebase.Firestore.createDocument(&fbdo, PROJECT_ID, "", path, newHistoryData.raw())) {
                  Serial.println("New history created.");
                } else {
                  Serial.println(fbdo.errorReason());
                }
              }
            }
          }
        }
      }
    }
  } else {
    Serial.println(fbdo.errorReason());
  }
}

bool isScheduled() {
  timeClient.update();
  int currentHour = timeClient.getHours() + 7; // UTC -> UTC+7
  int currentMinute = timeClient.getMinutes();
  return currentHour == SCHEDULE_HOUR && currentMinute == 0;
}