// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFd35Va8XbsiXnCxs9TG57VpdXeTPSDSI",
  authDomain: "awtdb-ec169.firebaseapp.com",
  projectId: "awtdb-ec169",
  storageBucket: "awtdb-ec169.firebasestorage.app",
  messagingSenderId: "842082237094",
  appId: "1:842082237094:web:2fd0ca0918d3dc33e4d267",
  measurementId: "G-M9CW4PBB81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);