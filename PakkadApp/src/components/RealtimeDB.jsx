import React, { useEffect, useState } from 'react';
import firebaseApp from '../firebase.js';
import { getDatabase, ref, onValue } from "firebase/database";

export const GetNpkFromRealtimeDB = (sensor) =>{
  const realtimeDB = getDatabase(firebaseApp);
  // let sensor = "test"
  // Define Realtime Database Path
  const dataRedPath = `${sensor}/red`;
  const dataGreenPath = `${sensor}/green`;
  const dataBluePath = `${sensor}/blue`;
  const realtimeDBRefRed = ref(realtimeDB, dataRedPath);
  const realtimeDBRefGreen = ref(realtimeDB, dataGreenPath);
  const realtimeDBRefBlue = ref(realtimeDB, dataBluePath);
  let readingRed;
  let readingGreen;
  let readingBlue;

  return Promise.all([
    new Promise((resolve) => {
      const unsubscribeRed = onValue(realtimeDBRefRed, (snapshot) => {
        resolve(snapshot.val());
        unsubscribeRed();
      });
    }),
    new Promise((resolve) => {
      const unsubscribeGreen = onValue(realtimeDBRefGreen, (snapshot) => {
        resolve(snapshot.val());
        unsubscribeGreen();
      });
    }),
    new Promise((resolve) => {
      const unsubscribeBlue = onValue(realtimeDBRefBlue, (snapshot) => {
        resolve(snapshot.val());
        unsubscribeBlue();
      });
    }),
  ]);
};

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
    // useEffect(() => {
    //     onValue(realtimeDBRefRed, (snapshot) => {
    //         const data = snapshot.val();
    //         setReadingRed(data);
    //     });

    //     onValue(realtimeDBRefGreen, (snapshot) => {
    //         const data = snapshot.val();
    //         setReadingGreen(data);
    //     });

    //     onValue(realtimeDBRefBlue, (snapshot) => {
    //         const data = snapshot.val();
    //         setReadingBlue(data);
    //     });

    // })

    useEffect(() => {
        const unsubscribeRed = onValue(realtimeDBRefRed, (snapshot) => {
          const data = snapshot.val();
          setReadingRed(data);
        });
    
        const unsubscribeGreen = onValue(realtimeDBRefGreen, (snapshot) => {
          const data = snapshot.val();
          setReadingGreen(data);
        });
    
        const unsubscribeBlue = onValue(realtimeDBRefBlue, (snapshot) => {
          const data = snapshot.val();
          setReadingBlue(data);
        });
    
        // Clean up function to prevent memory leaks
        return () => {
          unsubscribeRed();
          unsubscribeGreen();
          unsubscribeBlue();
        };
      }, []);

    
    return {
        readingRed,
        readingGreen,
        readingBlue,
      };
};

export default RealtimeDB;