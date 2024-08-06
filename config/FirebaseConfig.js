// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
