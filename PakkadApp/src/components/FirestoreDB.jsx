import React, { useState, useEffect } from 'react';
import firebaseApp from '../firebase.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc} from 'firebase/firestore';
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

export const AddNpkToPlotHistory = async (userEmail, viewingPlot, npkData) =>{
  var userDocumentId = await GetUserDocumentId(userEmail);

  if (userDocumentId) {
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const historyCollectionRef = collection(firestoreDB, "user_DB", userDocumentId, "plot_DB", viewingPlot, "history_DB");
      
      const newHistoryDoc = await addDoc(historyCollectionRef,npkData);

      return newHistoryDoc;
    } catch (error) {
      console.error("Error fetching plot data:", error);
      return [];
    }
  } else {
    console.log("User document ID is not available yet.");
    
    return [];
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

export const addUserToFirestore = async (email) => {
  const firestoreDB = getFirestore(firebaseApp);
  const userCollection = collection(firestoreDB, "user_DB");

  // ตั้งค่าข้อมูล email 
  const data = {
    email: email,
  };
  // สร้าง document
  const docRef =await addDoc(userCollection, data);

  // สร้าง subcollection ใหม่
  const subcollectionRef = collection(docRef, "plot_DB");
};

export const addUserPlot = async(userEmail, gardenName, file, sensorName, vegName) =>{
  var userDocumentId = await GetUserDocumentId(userEmail);

  if(userDocumentId){
    try {
      const firestoreDB = getFirestore(firebaseApp);
      const userDocRef = doc(firestoreDB, "user_DB", userDocumentId);
      const plotCollection = collection(userDocRef, "plot_DB");
      console.log("test");

      const newPlotDoc = await addDoc(plotCollection, {
        garden_name: gardenName,
        image:"./path/image",
        sensor: sensorName,
        veg_name: vegName,
      });

      EditPlot(userEmail,newPlotDoc.id,"image",file ? await saveImageToStorage(file, newPlotDoc.id) : "./path/image");

      const historyCollection = await collection(newPlotDoc, "history_DB");
      const historydoc = await addDoc(historyCollection, {
        NITROGEN: 0,
        PHOSPHORUS: 0,
        POTASSIUM: 0,
        date: new Date(),
      });

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
