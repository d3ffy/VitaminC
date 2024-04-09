import firebaseApp from '../firebase.js';

import { getDatabase, ref, onValue, set } from "firebase/database";

export const GetNpkFromRealtimeDB = (sensor, userId) => {
  const realtimeDB = getDatabase(firebaseApp);
  const dataRedPath = `${userId}/${sensor}/nitrogen`;
  const dataGreenPath = `${userId}/${sensor}/phosphorus`;
  const dataBluePath = `${userId}/${sensor}/potassium`;
  const dataCOMMANDPath = `${userId}/${sensor}/COMMAND`;

  const realtimeDBRefRed = ref(realtimeDB, dataRedPath);
  const realtimeDBRefGreen = ref(realtimeDB, dataGreenPath);
  const realtimeDBRefBlue = ref(realtimeDB, dataBluePath);
  const realtimeDBRefCOMMAND = ref(realtimeDB, dataCOMMANDPath);

  return new Promise((resolve, reject) => {
    let processTimeoutId;
    let noneTimeoutId;

    set(realtimeDBRefCOMMAND, "RUN")
      .then(() => {
        processTimeoutId = setTimeout(() => {
          checkCommandProcess();
          set(realtimeDBRefCOMMAND, "NONE")
            .then(() => {
              reject(new Error("Command did not become PROCESS within the specified timeout"));
            })
            .catch((error) => {
              reject(error);
            });
        }, 10000);

        const checkCommandProcess = onValue(realtimeDBRefCOMMAND, (snapshot) => {
          const command = snapshot.val();
          if (command === "PROCESS") {
            clearTimeout(processTimeoutId);
            checkCommandProcess();

            noneTimeoutId = setTimeout(() => {
              checkCommandNone();
              set(realtimeDBRefCOMMAND, "NONE")
                .then(() => {
                  reject(new Error("Command did not become NONE within the specified timeout"));
                })
                .catch((error) => {
                  reject(error);
                });
            }, 20000);

            const checkCommandNone = onValue(realtimeDBRefCOMMAND, async (snapshot) => {
              const command = snapshot.val();
              if (command === "NONE") {
                clearTimeout(noneTimeoutId);
                checkCommandNone();

                try {
                  const [nitrogenValue, phosphorusValue, potassiumValue] = await Promise.all([
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

                  resolve({ nitrogen: nitrogenValue, phosphorus: phosphorusValue, potassium: potassiumValue });
                } catch (error) {
                  reject(error);
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const GetNpkFromRealtimeDBOld = (sensor, userId) => {
  const realtimeDB = getDatabase(firebaseApp);
  const dataRedPath = `${userId}/${sensor}/nitrogen`;
  const dataGreenPath = `${userId}/${sensor}/phosphorus`;
  const dataBluePath = `${userId}/${sensor}/potassium`;
  const dataCOMMANDPath = `${userId}/${sensor}/COMMAND`;

  const realtimeDBRefRed = ref(realtimeDB, dataRedPath);
  const realtimeDBRefGreen = ref(realtimeDB, dataGreenPath);
  const realtimeDBRefBlue = ref(realtimeDB, dataBluePath);
  const realtimeDBRefCOMMAND = ref(realtimeDB, dataCOMMANDPath);

  set(realtimeDBRefCOMMAND, "RUN");

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

// const RealtimeDB = () => {
//     // Initialize Realtime Database from Firebase
//     const realtimeDB = getDatabase(firebaseApp);

//     // Define Realtime Database Path
//     const dataRedPath = 'test/red';
//     const dataGreenPath = 'test/green';
//     const dataBluePath = 'test/blue';
//     const realtimeDBRefRed = ref(realtimeDB, dataRedPath);
//     const realtimeDBRefGreen = ref(realtimeDB, dataGreenPath);
//     const realtimeDBRefBlue = ref(realtimeDB, dataBluePath);

//     // Define Variable
//     const [readingRed, setReadingRed] = useState(null);
//     const [readingGreen, setReadingGreen] = useState(null);
//     const [readingBlue, setReadingBlue] = useState(null);

//     // Realtime Update Value red, green and blue
//     // useEffect(() => {
//     //     onValue(realtimeDBRefRed, (snapshot) => {
//     //         const data = snapshot.val();
//     //         setReadingRed(data);
//     //     });

//     //     onValue(realtimeDBRefGreen, (snapshot) => {
//     //         const data = snapshot.val();
//     //         setReadingGreen(data);
//     //     });

//     //     onValue(realtimeDBRefBlue, (snapshot) => {
//     //         const data = snapshot.val();
//     //         setReadingBlue(data);
//     //     });

//     // })

//     useEffect(() => {
//         const unsubscribeRed = onValue(realtimeDBRefRed, (snapshot) => {
//           const data = snapshot.val();
//           setReadingRed(data);
//         });
    
//         const unsubscribeGreen = onValue(realtimeDBRefGreen, (snapshot) => {
//           const data = snapshot.val();
//           setReadingGreen(data);
//         });
    
//         const unsubscribeBlue = onValue(realtimeDBRefBlue, (snapshot) => {
//           const data = snapshot.val();
//           setReadingBlue(data);
//         });
    
//         // Clean up function to prevent memory leaks
//         return () => {
//           unsubscribeRed();
//           unsubscribeGreen();
//           unsubscribeBlue();
//         };
//       }, []);

    
//     return {
//         readingRed,
//         readingGreen,
//         readingBlue,
//       };
// };

// export default RealtimeDB;