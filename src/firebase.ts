import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBp3iKTpZspIs_pmFZosDAwqWnbke1mMyk",
  authDomain: "expense-tracker-5c.firebaseapp.com",
  projectId: "expense-tracker-5c",
  storageBucket: "expense-tracker-5c.firebasestorage.app",
  messagingSenderId: "209414624145",
  appId: "1:209414624145:web:e05e6146c8aa8b42498030",
  measurementId: "G-R4TTCJ1RY1"

};

const app = initializeApp(firebaseConfig);

// Auth + Google Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);