import React, { useState, useEffect } from 'react';
import firebaseApp from '../firebase.js';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const FirestoreDB = () => {
  // Initialize Firestore from Firebase
  const firestoreDB = getFirestore(firebaseApp);

  // Define Firestore Path
  const userCollection = collection(firestoreDB, 'user-test');

  // Define Variable
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [users, setUsers] = useState([]);
  var wasFetch = false;

  useEffect(() => {
    // Fetch data from Firestore when the component mounts
    async function fetchUsers() {
      try {
        if (!wasFetch) {
          const querySnapshot = await getDocs(userCollection);
          const userData = querySnapshot.docs.map((doc) => doc.data());
          setUsers(userData);

          // Control over fetching
          wasFetch = true;
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
