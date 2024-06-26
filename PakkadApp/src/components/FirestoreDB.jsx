import React, { useState, useEffect } from 'react';
import firebaseApp from '../firebase.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc ,getDoc  ,getCollections, setDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuth  } from "./AuthContext.jsx";


export const GetUserEmail = () => {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    const fetchUserEmail = () => {
      if (user) {
        setUserEmail(user.email);
        
        // console.log('User email:', user.email);
      }
    };
    fetchUserEmail();
  }, [user]);

  return userEmail;
};
export const GetUserDocumentId = async (userEmail) => {
  const firestoreDB = getFirestore(firebaseApp);
  const userCollection = collection(firestoreDB, "user_DB");

  if (userEmail) {
    const querySnapshot = await getDocs(userCollection);
    for (const doc of querySnapshot.docs) {
      if (doc.data().email === userEmail) {
        return doc.id;
      }
    }
  }

  return null;
};
export const GetSensorNames = async () => {
  try{
    const firestoreDB = getFirestore(firebaseApp);
    const sensorCollection = collection(firestoreDB, 'sensor_DB');
    const sensorNames = [];
    const querySnapshot = await getDocs(sensorCollection);
    querySnapshot.forEach((doc) => {
      const sensorName = doc.data().sensor_name;
      sensorNames.push(sensorName);
    });
    
    return sensorNames;
  }
    catch(error){
      console.error("Error fetching sensor names:", error);
    };
};
// เอาชื่อ garden_name
export const GetPlotData = async (userEmail) => {
  var userDocumentId = await GetUserDocumentId(userEmail);

  if (userDocumentId) {
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const userDocRef = doc(firestoreDB, "user_DB", userDocumentId);
      const plotCollection = collection(userDocRef, "plot_DB");
      const querySnapshot = await getDocs(plotCollection);

      const plotData = [];
      querySnapshot.forEach((doc) => {
        const plot = doc.data();
        plot.id = doc.id;
        plotData.push(plot.garden_name);
      });

      // console.log(plotData);
      // console.log(userDocumentId);
      return plotData;
    } catch (error) {
      console.error("Error fetching plot data:", error);
      return [];
    }
  } else {
    console.log("User document ID is not available yet.");
    
    return [];
  }
};
// เอาชื่อ doc ทั้งหมด ใน plot
export const GetPlotInfo = async (userEmail) => {
  var userDocumentId = await GetUserDocumentId(userEmail);

  if (userDocumentId) {
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const userDocRef = doc(firestoreDB, "user_DB", userDocumentId);
      const plotCollection = collection(userDocRef, "plot_DB");
      const querySnapshot = await getDocs(plotCollection);

      const plotData = [];
      querySnapshot.forEach((doc) => {
        const plot = doc.data();
        plot.id = doc.id;
        plotData.push(plot);
      });

      return plotData;
    } catch (error) {
      console.error("Error fetching plot data:", error);
      return [];
    }
  } else {
    console.log("User document ID is not available yet.");
    
    return [];
  }
};
export const GetHistoryInfo = async (userEmail , viewingPlot) =>{
  var userDocumentId = await GetUserDocumentId(userEmail);

  if (userDocumentId) {
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const historyCollectionRef = collection(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot, "history_DB");
      const querySnapshot = await getDocs(historyCollectionRef);
      
      const historyData = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const dateObj = docData.date.toDate();
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // เดือนเริ่มจาก 0 ถึง 11 ดังนั้นต้องบวก 1
        const year = dateObj.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        const historyItem = {
          id: doc.id,
          nitrogen: docData.NITROGEN,
          phosphorus: docData.PHOSPHORUS,
          potassium: docData.POTASSIUM,
          date: formattedDate,
        };
        historyData.push(historyItem);
      });
      // console.log("History Data:", historyData);
      // console.log("History Data:", historyData[0]);
      // console.log("History Data:", historyData[0].date);
      historyData.sort((a, b) => new Date(b.date) - new Date(a.date));

      return historyData;
    } catch (error) {
      console.error("Error fetching plot data:", error);
      return [];
    }
  } else {
    console.log("User document ID is not available yet.");
    
    return [];
  }
};
export const GetPlotDocByID = async (userEmail , viewingPlot) =>{
  var userDocumentId = await GetUserDocumentId(userEmail);

  if (userDocumentId) {
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const plotDocRef = doc(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot);

      // ดึงข้อมูลจาก document
      const plotDocSnapshot = await getDoc(plotDocRef);

      // เข้าถึงข้อมูลใน document
      if (plotDocSnapshot.exists()) {
        const plotData = plotDocSnapshot.data();
        // ทำการประมวลผลข้อมูลต่อไป
        return plotData;
      } else {
        console.log("Plot document does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error fetching plot data:", error);
      return null;
    }
  } else {
    console.log("User document ID is not available yet.");
    return null;
  }
};
export const getPlantData = async () => {
  try {
    const firestoreDB = getFirestore(firebaseApp);
    const plantCollection = collection(firestoreDB, "plant_DB");
    const querySnapshot = await getDocs(plantCollection);
    const plantData = [];
    querySnapshot.forEach((doc) => {
      const plant = doc.data();
      plant.id = doc.id;
      plantData.push(plant);

    });

    return plantData ;
  } catch (error) {
    console.error("Error fetching plot data:", error);
    return [];
  }
};
export const getSensorOfUser = async (userEmail) => {
  var userDocumentId = await GetUserDocumentId(userEmail);

  if (userDocumentId) {
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const userDocRef = doc(firestoreDB, "user_DB", userDocumentId);
      const plotCollection = collection(userDocRef, "sensor_DB");
      const querySnapshot = await getDocs(plotCollection);

      const sensorData = [];

      // Loop through each document in the sensor_DB collection
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const name = data.name; // Get the 'name' field value
        const documentId = doc.id; // Get the document ID

        // Add the name and document ID to the sensorData array
        sensorData.push({ name, documentId });
      });

      // console.log(plotData);
      // console.log(userDocumentId);
      return sensorData;
    } catch (error) {
      console.error("Error fetching plot data:", error);
      return [];
    }
  } else {
    console.log("User document ID is not available yet.");
    
    return [];
  }
};


export const AddNpkToPlotHistory = async (userEmail, viewingPlot, npkData) => {
  var userDocumentId = await GetUserDocumentId(userEmail);
  
  if (userDocumentId) {
    try {
      const firestoreDB = getFirestore(firebaseApp);
      
      // อ้างอิงไปยัง document ของแปลงที่กำลังดูอยู่
      const plotDocRef = doc(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot);
      
      // สร้าง subcollection "history_DB" ภายใต้ document ของแปลง
      const historyCollectionRef = collection(plotDocRef, "history_DB");
      
      // เพิ่มเอกสารใหม่ที่มีข้อมูล NPK ลงใน subcollection "history_DB"
      const newHistoryDoc = await addDoc(historyCollectionRef, npkData);
      
      return newHistoryDoc;
    } catch (error) {
      console.error("Error adding NPK data to plot history:", error);
      throw error;
    }
  } else {
    console.log("User document ID is not available yet.");
    throw new Error("User document ID is not available.");
  }
};
export const addUserToFirestore = async (email,uid) => {
  const firestoreDB = getFirestore(firebaseApp);
  const userCollection = collection(firestoreDB, "user_DB");

  const docRef = doc(userCollection, uid);

  // ตั้งค่าข้อมูล email 
  const data = {
    email: email,
  };

  // สร้าง document
  await setDoc(docRef, data);
  // const docRef = doc(userCollection, email);

  // สร้าง subcollection ใหม่
  // const subcollectionRef = collection(docRef, "plot_DB");
  // const plotData = {
  //   garden_name: "carrot",
  //   image: "./path/image",
  //   sensor: "sonsor1",
  //   veg_name: "ผักคอส",
  // };
  // const plotDocRef = await addDoc(subcollectionRef, plotData);
  // const historySubcollectionRef = collection(plotDocRef, "history_DB");

  // // เพิ่ม document ใน subcollection history_DB
  // const historyData = {
  //   NITROGEN: 1,
  //   PHOSPHORUS: 2,
  //   POTASSIUM: 3,
  //   date: new Date(),
  // };
  // await addDoc(historySubcollectionRef, historyData);
};
export const addUserPlot = async(userEmail, gardenName, file, sensorName, vegName) =>{
  var userDocumentId = await GetUserDocumentId(userEmail);

  if(userDocumentId){
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const userDocRef = doc(firestoreDB, "user_DB", userDocumentId);
      const plotCollection = collection(userDocRef, "plot_DB");

      const newPlotDoc = await addDoc(plotCollection, {
        garden_name: gardenName,
        image:"./path/image",
        sensor: sensorName,
        veg_name: vegName,
        autoCheckInTime: "00:01",
        autoCheckStatus: false
      });

      EditPlot(userEmail,newPlotDoc.id,"image",file ? await saveImageToStorage(file, newPlotDoc.id) : "./path/image");

      // const historyCollection = await collection(newPlotDoc, "history_DB");
      // const historydoc = await addDoc(historyCollection, {
      //   NITROGEN: 0,
      //   PHOSPHORUS: 0,
      //   POTASSIUM: 0,
      //   date: new Date(),
      // });

      return newPlotDoc.id;
    } catch (error) {
      console.error("Error fetching plot data:", error);
      return [];
    }
  }
}
export const deletePlot = async (userEmail, viewingPlot) => {
  const deleteImage = async () =>{
    const storage = getStorage();
    const storageRef = ref(storage, `images/${viewingPlot}`);
    await deleteObject(storageRef).catch((error) => {
    if (error.code !== "storage/object-not-found") {
      throw error;
    }
  });
  }
  if (viewingPlot) {
    try {
      const userDocumentId = await GetUserDocumentId(userEmail);
      const firestoreDB = getFirestore(firebaseApp);
      const plotRef = doc(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot);

      // ลบ subcollection "history_DB" ****ถ้าไม่ลบ doc ข้างในให้หมด จะลบ collection ไม่ได้****
      const historyCollectionRef = collection(plotRef, "history_DB");
      const historyDocs = await getDocs(historyCollectionRef);
      for (const doc of historyDocs.docs) {
        await deleteDoc(doc.ref);
      }

      // ลบ doc "plot"
      await deleteDoc(plotRef);

      await deleteImage();
    } catch (error) {
      console.error("Error deleting plot:", error);
    }
  }
};
export const EditPlot = async (userEmail, viewingPlot, valueTarget, newValue) =>{
  if (viewingPlot) {
    try {
      const userDocumentId = await GetUserDocumentId(userEmail);
      const firestoreDB = getFirestore(firebaseApp);
      const plotRef = doc(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot);
      
      plotRef[valueTarget] = newValue;

      await updateDoc(plotRef, { [valueTarget]: newValue });
    } catch (error) {
      console.error("Error deleting plot:", error);
    }
  }
}
export const UpdateAutoCheckTime = async (userEmail, viewingPlot, time, status) =>{
  if (viewingPlot) {
    try {
      const userDocumentId = await GetUserDocumentId(userEmail);
      const firestoreDB = getFirestore(firebaseApp);
      const plotRef = doc(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot);
      
      // Update the document with the new time data
      await updateDoc(plotRef, {
        autoCheckInTime: time , // Assuming you want a field called 'autoCheckInTime'\
        autoCheckStatus: status
      }); 
    } catch (error) {
      console.error("Error deleting plot:", error);
    }
  }
}

export const saveImageURLToFirestore = async (userEmail, viewingPlot, imageURL) => {
  if (viewingPlot) {
    try{
      const userDocumentId = await GetUserDocumentId(userEmail);
      const firestoreDB = getFirestore(firebaseApp);
      const userRef = doc(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot);
      await updateDoc(userRef, { "image": imageURL });
    } catch (error) {
      console.error("Error deleting plot:", error);
    }
  }
};
export const handleImageFileChange = async (userEmail,viewingPlot,file) => {
  if (file) {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${viewingPlot}`);

    const existingFileRef = ref(storage, `images/${viewingPlot}`);
    await deleteObject(existingFileRef).catch((error) => {
      // ถ้าไม่มีไฟล์เดิม จะเกิด error แต่สามารถไล่ไปได้
      if (error.code !== "storage/object-not-found") {
        throw error;
      }
    });

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    // เก็บ downloadURL ไว้ใน Firestore
    saveImageURLToFirestore(userEmail,viewingPlot,downloadURL);
    return downloadURL;
  }
};
export const saveImageToStorage = async (file,plotId) => {
  if (file) {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${plotId}`);

    const existingFileRef = ref(storage, `images/${plotId}`);
    await deleteObject(existingFileRef).catch((error) => {
      // ถ้าไม่มีไฟล์เดิม จะเกิด error แต่สามารถไล่ไปได้
      if (error.code !== "storage/object-not-found") {
        throw error;
      }
    });
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }
};

export const calcNpkResultStatusMainPage = async (userEmail,viewingPlot,nitrogen,phosphorus,potassium) => {
  const plotInfos = await GetPlotInfo(userEmail);
  const historyData = await GetHistoryInfo(userEmail,viewingPlot);
  const plantData = await getPlantData();
  // get plotInfo.sensor, veg_name, garden_name, image, id ของ viewingPlot 
  const plotInfo = plotInfos.find((info) => info.id === viewingPlot) || {};
  // get ค่า npm ที่เหมาะสม plantInfo.name ,nitrogen_start ,nitrogen_end
  const plantInfo = plantData.find((plant) => plant.name === plotInfo.veg_name) || {};
  const nitrogenStatus = calculateNutrientStatus(
    plantInfo.nitrogen_start,
    plantInfo.nitrogen_end,
    nitrogen,
    "N"
  );
  const phosphorusStatus = calculateNutrientStatus(
    plantInfo.phosphorus_start,
    plantInfo.phosphorus_end,
    phosphorus,
    "P"
  );
  const potassiumStatus = calculateNutrientStatus(
    plantInfo.potassium_start,
    plantInfo.potassium_end,
    potassium,
    "K"
  );
  const IsNitrogenStatusInRange = nitrogenStatus.isInRange;
  const IsPhosphorusStatusInRange = phosphorusStatus.isInRange;
  const IsPotassiumStatusStatusInRange = potassiumStatus.isInRange;

  return {IsNitrogenStatusInRange , IsPhosphorusStatusInRange ,IsPotassiumStatusStatusInRange};
}
export const calcNpkResult = async (userEmail,viewingPlot) => {
  const plotInfos = await GetPlotInfo(userEmail);
  const historyData = await GetHistoryInfo(userEmail,viewingPlot);
  const plantData = await getPlantData();
  // get plotInfo.sensor, veg_name, garden_name, image, id ของ viewingPlot 
  const plotInfo = plotInfos.find((info) => info.id === viewingPlot) || {};
  // get ค่า npm ที่เหมาะสม plantInfo.name ,nitrogen_start ,nitrogen_end
  const plantInfo = plantData.find((plant) => plant.name === plotInfo.veg_name) || {};

  const calcNpkCollection = historyData.map((historyItem) => {
    const { nitrogen, phosphorus, potassium, id, date } = historyItem;
    const npkStatus = calculateNpkStatus(plantInfo, nitrogen, phosphorus, potassium);

    return {
      id,
      nitrogen,
      phosphorus,
      potassium,
      summary: npkStatus.summary,
      date,
      status: npkStatus.isInRange,
    };
  });

  return calcNpkCollection;
};
const calculateNpkStatus = (plantInfo, nitrogen, phosphorus, potassium) => {
  const nitrogenStatus = calculateNutrientStatus(
    plantInfo.nitrogen_start,
    plantInfo.nitrogen_end,
    nitrogen,
    "N"
  );
  const phosphorusStatus = calculateNutrientStatus(
    plantInfo.phosphorus_start,
    plantInfo.phosphorus_end,
    phosphorus,
    "P"
  );
  const potassiumStatus = calculateNutrientStatus(
    plantInfo.potassium_start,
    plantInfo.potassium_end,
    potassium,
    "K"
  );

  const summary = `${nitrogenStatus.summary} | ${phosphorusStatus.summary} | ${potassiumStatus.summary}`;
  const isInRange = nitrogenStatus.isInRange && phosphorusStatus.isInRange && potassiumStatus.isInRange;

  return { summary, isInRange };
};
const calculateNutrientStatus = (start, end, value, nutrient) => {
  const isInRange = value >= start && value <= end;
  const diff = isInRange ? 0 : Math.abs(value - start);
  const status = isInRange ? "inRange" : value < start ? "lower" : "more";

  let summary;
  switch (status) {
    case "lower":
      summary = `${nutrient} < ${diff}`;
      break;
    case "more":
      summary = `${nutrient} > ${diff}`;
      break;
    case "inRange":
      summary = `${nutrient} is In Range`;
      break;
  }

  return { summary, isInRange };
};

const FirestoreDB = () => {
  // Initialize Firestore from Firebase
  const firestoreDB = getFirestore(firebaseApp);

  // Define Firestore Path
  const userCollection = collection(firestoreDB, 'user-test');

  // Define Variable
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [users, setUsers] = useState([]);
  const [wasFetch, setWasFetch] = useState(false);

  useEffect(() => {
    // Fetch data from Firestore when the component mounts
    async function fetchUsers() {
      try {
        if (!wasFetch) {
          const querySnapshot = await getDocs(userCollection);
          const userData = querySnapshot.docs.map((doc) => doc.data());
          setUsers(userData);

          // Control over fetching
          setWasFetch(true);
        }
      } catch (error) {
        console.error('Error fetching documents: ', error.message);
      }
    }
  
    fetchUsers();
  }, []); 

  async function insertDocument() {
    try {
      // Add new Document in Firestore
      const docRef = await addDoc(userCollection, {
        firstName,
        lastName,
      });

      // Clear Input Fields
      setFirstName('');
      setLastName('');

      // Clear fetching control
      wasFetch = false;

      // Success Notification 
      alert(`new document has been inserted as ${ docRef.id }`)
    } catch (error) {
      console.error('Error adding document: ', error.message);
    }
  }


  return (
    <div>
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

      <button onClick={insertDocument}>Save</button>

      {/* Display the list of users */}
      <div>
        <h2>User List</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FirestoreDB;
