// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3oIJ8Zp4HcanI_BAlRrPb3cBnCxtxISc",
  authDomain: "dashboard-84b0b.firebaseapp.com",
  projectId: "dashboard-84b0b",
  storageBucket: "dashboard-84b0b.appspot.com",
  messagingSenderId: "475183682014",
  appId: "1:475183682014:web:3176b339a9d0c8e8bf8d4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };