import React, { useEffect, useState } from 'react';
import firebaseApp from '../firebase.js';
import { getDatabase, ref, onValue } from "firebase/database";

const RealtimeDB = () => {
    // Initialize Realtime Database from Firebase
    const realtimeDB = getDatabase(firebaseApp);

    // Define Realtime Database Path
    const dataRedPath = 'test/red';
    const dataGreenPath = 'test/green';
    const dataBluePath = 'test/blue';
    const realtimeDBRefRed = ref(realtimeDB, dataRedPath);
    const realtimeDBRefGreen = ref(realtimeDB, dataGreenPath);
    const realtimeDBRefBlue = ref(realtimeDB, dataBluePath);

    // Define Variable
    const [readingRed, setReadingRed] = useState(null);
    const [readingGreen, setReadingGreen] = useState(null);
    const [readingBlue, setReadingBlue] = useState(null);

    // Realtime Update Value red, green and blue
    useEffect(() => {
        onValue(realtimeDBRefRed, (snapshot) => {
            const data = snapshot.val();
            setReadingRed(data);
        });

        onValue(realtimeDBRefGreen, (snapshot) => {
            const data = snapshot.val();
            setReadingGreen(data);
        });

        onValue(realtimeDBRefBlue, (snapshot) => {
            const data = snapshot.val();
            setReadingBlue(data);
        });
    })

    // Display HTML
    return (
        <div>
          <p>Reading Red: <span id="reading-red">{readingRed}</span></p>
          <p>Reading Green: <span id="reading-green">{readingGreen}</span></p>
          <p>Reading Blue: <span id="reading-blue">{readingBlue}</span></p>
        </div>
    );
}

export default RealtimeDB;