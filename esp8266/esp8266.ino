#include <ESP8266WiFi.h> // WiFi library for ESP8266
#include <Firebase_ESP_Client.h> // Firebase client library for ESP8266 and ESP32
#include <NTPClient.h> // Network Time Protocol client library for getting accurate time
#include <WiFiUdp.h> // Library for handling UDP connections, needed for NTPClient

#include <addons/TokenHelper.h> // Helper for Firebase authentication token
#include <addons/RTDBHelper.h> // Helper for handling Firebase RTDB operations

// WiFi and Firebase Configuration
const char* WIFI_SSID = "WIFI_NAME";
const char* WIFI_PASS = "WIFI_PASSWORD";
const char* API_KEY = "FIREBASE_API_KEY";
const char* DATABASE_URL = "FIREBASE_DATABASE_URL";
const char* PROJECT_ID = "FIREBASE_PROJECT_ID";
const char* USER_EMAIL = "USER_EMAIL";
const char* USER_PASSWORD = "USER_PASSWORD";
const char* SENSOR_NAME = "SENSOR_NAME";

// Global Variables and Objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
String path_RTDB;
unsigned long lastFetch;

// timeClient to get current time from NTP server
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);
uint8_t SCHEDULE_HOUR = 12; // Set the scheduled hour in UTC+7

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
  // Handle time updates, command processing, and message handling
  static String receivedMessage;
  while (WiFi.status() == WL_CONNECTED) {
    timeClient.update();
    if (isScheduled()) {
      // Sent Schedule Command to Arduino
      Serial.println(F("Schedule time"));
      Serial.println(F("READ"));
      delay(60 * 1000); // Delay 60 second for avioding multiple request
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
      delay(60 * 1000); // Delay 60 second for avioding multiple request
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
      }
      lastFetch = millis();

  } else if (receivedMessage.startsWith("ERROR")) {
    Serial.println(F("Error: please wait and try again"));
    Firebase.RTDB.setString(&fbdo, path_RTDB + "/COMMAND", "ERROR");
    Serial.println(F("Changing command to ERROR"));
  }
}

void connectWiFi() {
  // Initialize WiFi connection
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
  Serial.println(F("Firebase connected successfully"));
}

void sentValueToRTDB(const float& nitrogen, const float& phosphorus, const float& potassium) {
  // Send sensor values to Firebase RTDB
  if (Firebase.RTDB.setFloat(&fbdo, path_RTDB + "/nitrogen", nitrogen) &&
      Firebase.RTDB.setFloat(&fbdo, path_RTDB + "/phosphorus", phosphorus) &&
      Firebase.RTDB.setFloat(&fbdo, path_RTDB + "/potassium", potassium)){
    Serial.println(F("Sent value to RTDB successfully."));
  } else {
    Serial.println(fbdo.errorReason());}
}

void initRTDB() {
  // Set initial RTDB command state to "NONE"
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
  // Set initial RTDB command state to "NONE"
  Serial.println(F("Initializing Firestore"));

  if (!checkSensorName()) {
    // If sensor name isn't initialized
    // Create sensor field
    String path = "user_DB/" + String(auth.token.uid.c_str()) "/sensor_DB";
    FirebaseJson json;
    json.set("fields/name/stringValue", SENSOR_NAME);
    if (Firebase.Firestore.createDocument(&fbdo, PROJECT_ID, "", path, json.raw())) {
      Serial.println(F("Firebase sensor_name created"));
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
  // Format the current time into an ISO 8601 string
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
  // Retrieve the document ID for the sensor from Firestore.
  // This involves querying Firestore for the 'sensor_DB' collection associated with the user,
  // iterating through documents to find a match for the sensor name, and then extracting the document ID.
  String path = "user_DB/" + String(auth.token.uid.c_str()) + "/sensor_DB";
  if (Firebase.Firestore.getDocument(&fbdo, PROJECT_ID, "", path, "name")) {
    FirebaseJson json;
    FirebaseJsonData jsonData;
    json.setJsonData(fbdo.payload().c_str());

    // Parse through documents to find the sensor name and retrieve its document ID.
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
                return fullPath.substring(lastSlashIndex + 1); // Extract and return the document ID
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
  // Get sensor document ID and use it to send nutrient values to Firestore.
  // This function creates a new document in the 'history_DB' subcollection under the appropriate 'plot_DB' document.
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
    
    // Parse documents to find a matching plot for the sensor, then create a new history entry.
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

                // Append the document ID to path and setup new history data with timestamp.
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
  // Check if the current time matches the scheduled time for an action
  timeClient.update();
  int currentHour = timeClient.getHours() + 7; // UTC -> UTC+7
  int currentMinute = timeClient.getMinutes();
  return currentHour == SCHEDULE_HOUR && currentMinute == 0;
}