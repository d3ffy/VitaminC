# NPK Measuring by Arduino Uno R3 WiFi with TCS34725
Software Project for SF342 [Software Construction Project 2] - Thammasat University

## 🌟 Features

This application allows users to measure the levels of Nitrogen (N), Phosphorus (P), and Potassium (K) using an Arduino Uno R3 with WiFi capabilities. Features include:

- **Real-Time Data Measurement**: Utilizing and controlling the TCS34725 color sensor.
- **Data Storage**: Integration with Firebase for real-time database updates.
- **Web Interface**: A clean web application for data visualization.

## 🛠️ Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js)

### Installation

```
git clone https://github.com/d3ffy/VitaminC.git
cd PakkadApp
npm install
```

> [!IMPORTANT]
> You need to add file `PakkadApp/src/firebase.js` and include your Firebase API Key. Your file should be like this.
```JavaScript
// PakkadApp/src/firebase.js
import { initializeApp } from "firebase/app";

// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
```

### Running the Application

To run the React application locally, use the following command: `npm start`

This will start the development server and open the application in your default web browser at `http://localhost:3000`. The page will automatically reload if you make any changes to the code.

## 📚 Acknowledgements
We are grateful for the support from:
- [Arduino Uno WiFi](https://docs.arduino.cc/retired/boards/arduino-uno-wifi/)
- [TCS34725 Datasheet](https://cdn-shop.adafruit.com/datasheets/TCS34725.pdf)
- [Adafruit TCS34725 Library](https://github.com/adafruit/Adafruit_TCS34725?tab=readme-ov-file)
- [ESP8266 WiFi Library](https://github.com/esp8266/Arduino)
- [mobizt Arduino Firebase Library](https://github.com/mobizt/Firebase-ESP-Client)
- [ESP8266: Getting Started with Firebase](https://randomnerdtutorials.com/esp8266-nodemcu-firebase-realtime-database/)
- [Arduino board communication (UART)](https://docs.arduino.cc/learn/communication/uart/)
- [React with Firebase](https://www.tutor4dev.com/article/2019-02-25-cloud-firestore-reactjs-crud-application)

## 🔧 Improvements
- More test result.
- Adding calibrating function to color sensor.
- Using more accurate color sensor.
- Using Machine Learning for predicting.

## 👨‍🏫 Advisor 
This project was advised and supervised by:
- Dr.Akkharawoot Takhom, Thammasat University.
- Dr.Yutana Chongjarearn, Thammasat University.
 
## 👨‍🎓 Collaborator
- Tanasit Vanachayangkul
- Orapa Nabumrung
- Chayapat Samapak
- Pradipat Jareanporn
- Mai Tokairin
