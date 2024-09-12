// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Import Firebase Authentication
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmnbyabDAJ1gYanHRVMc3wjkB0Ze1vEXc",
  authDomain: "bizconnect-eb2e4.firebaseapp.com",
  projectId: "bizconnect-eb2e4",
  storageBucket: "bizconnect-eb2e4.appspot.com",
  messagingSenderId: "356665018265",
  appId: "1:356665018265:web:6b0f0f71c5db58f5e7b508",
  measurementId: "G-FKCYTYXR71"
};

// Initialize Firebase
// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

import { getStorage } from "firebase/storage";
export const storage = getStorage(app);

export const usersRef = collection(db, 'users')
// const analytics = getAnalytics(app);