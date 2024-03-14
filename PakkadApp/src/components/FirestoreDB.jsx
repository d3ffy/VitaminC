import React, { useState, useEffect } from 'react';
import firebaseApp from '../firebase.js';
import { getFirestore, collection, addDoc, getDocs , doc} from 'firebase/firestore';
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

  // เพิ่ม document ใหม่ใน subcollection
  await addDoc(subcollectionRef, {
    garden_name: "ผักคอสแปลงที่1",
    data: "docdata",
  });
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
