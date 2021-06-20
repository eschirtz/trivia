// Bootstrap the firebase sdk
import firebase from "firebase/app";
import "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCekkmxHyNbhIrn_Q7t6PvrCEkmBIFDZ6s",
  authDomain: "fathers-day-trivia.firebaseapp.com",
  databaseURL: "https://fathers-day-trivia-default-rtdb.firebaseio.com",
  projectId: "fathers-day-trivia",
  storageBucket: "fathers-day-trivia.appspot.com",
  messagingSenderId: "136880006278",
  appId: "1:136880006278:web:27f810c926d2ad3f979d07",
  measurementId: "G-7XQ0PPB9L1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
