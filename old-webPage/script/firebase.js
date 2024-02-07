import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getFirestore, collection, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { firebaseConfig } from '/script/firebaseConfig.js'

// ค่อยแก้ละกัน -> firebaseConfig.js
// const firebaseConfig = {
//   apiKey: "AIzaSyCPkTRiFpWFcjuJvAiOZCqoMXJN2Gvtzjc",
//   authDomain: "vitaminc-4695a.firebaseapp.com",
//   databaseURL: "https://vitaminc-4695a-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "vitaminc-4695a",
//   storageBucket: "vitaminc-4695a.appspot.com",
//   messagingSenderId: "655752985201",
//   appId: "1:655752985201:web:e417d6d21ae348878ff9d0",
//   measurementId: "G-B26JQT515C"
// }

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

// get vegname from firestoreDB
const logFirstPlotData = async () => {
  try {
    const plotCollectionRef = collection(firestoreDB, "plot_DB");

    const q = query(plotCollectionRef, limit(1));

    const plotSnapshot = await getDocs(q);

    if (!plotSnapshot.empty) {
      const firstPlotData = plotSnapshot.docs[0].data();

      const vegName = firstPlotData.veg_name;
      console.log("Vegetable Name:", vegName);
    } else {
      console.log("No documents found in the collection");
    }
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};
logFirstPlotData();
