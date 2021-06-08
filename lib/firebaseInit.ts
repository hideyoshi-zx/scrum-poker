import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// firebase初期化
const firebaseConfig = {
  apiKey: "AIzaSyA5YY4OwKBI4qKbcqaBRMCC0TyTl7uT2rI",
  authDomain: "scrum-poker-6ed4e.firebaseapp.com",
  databaseURL: "https://scrum-poker-6ed4e-default-rtdb.firebaseio.com",
  projectId: "scrum-poker-6ed4e",
  storageBucket: "scrum-poker-6ed4e.appspot.com",
  messagingSenderId: "884741570772",
  appId: "1:884741570772:web:e8a1c7309f5efb74f4bb41",
  measurementId: "G-Y209SX1G2B"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
