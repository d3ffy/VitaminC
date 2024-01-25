import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { firebaseConfig } from '/firebaseConfig.js'

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Database Paths
var dataRedPath = 'test/red';
var dataGreenPath = 'test/green';
var dataBluePath = 'test/blue';

// Get database references
const databaseRed = ref(db, dataRedPath);
const databaseGreen = ref(db, dataGreenPath);
const databaseBlue = ref(db, dataBluePath);

// Function to update the HTML element safely
function updateElement(id, value) {
  var element = document.getElementById(id);
  if (element) {
    element.innerHTML = value;
  } else {
    console.error("Element not found. Check the ID or ensure the element exists: " + id);
  }
}

// Changing Value
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
