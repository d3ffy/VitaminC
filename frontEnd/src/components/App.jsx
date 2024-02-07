import React from "react";
import { GlobalStyle } from "./GlobalStyles";
import HeaderMenu from "./HeaderMenu";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";
import Test from "./Test";

function App(){
    return(
        <>
            <GlobalStyle />
            <HeaderMenu />
            <Test/>
        </>
    );
};

export default App;

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCPkTRiFpWFcjuJvAiOZCqoMXJN2Gvtzjc",
  authDomain: "vitaminc-4695a.firebaseapp.com",
  databaseURL: "https://vitaminc-4695a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vitaminc-4695a",
  storageBucket: "vitaminc-4695a.appspot.com",
  messagingSenderId: "655752985201",
  appId: "1:655752985201:web:e417d6d21ae348878ff9d0",
  measurementId: "G-B26JQT515C"
}

const app = initializeApp(firebaseConfig);
const realtimeDB = getDatabase(app);
const firestoreDB = getFirestore(app);

// Database Paths
var dataRedPath = 'test/red';
var dataGreenPath = 'test/green';
var dataBluePath = 'test/blue';

// Get database references
const databaseRed = ref(realtimeDB, dataRedPath);
const databaseGreen = ref(realtimeDB, dataGreenPath);
const databaseBlue = ref(realtimeDB, dataBluePath);

// Function to update the HTML element safely
function updateElement(id, value) {
  var element = document.getElementById(id);
  if (element) {
    element.innerHTML = value;
  } else {
    console.error("Element not found. Check the ID or ensure the element exists: " + id);
  }
}

// Check Value from realtimeDB
function checkValue() {
  onValue(databaseRed, (snapshot) => {
    const data = snapshot.val();
    updateElement("reading-red", data);
  });
  
  onValue(databaseGreen, (snapshot) => {
    const data = snapshot.val();
    updateElement("reading-green", data);
  });
  
  onValue(databaseBlue, (snapshot) => {
    const data = snapshot.val();
    updateElement("reading-blue", data);
  });
};
checkValue();