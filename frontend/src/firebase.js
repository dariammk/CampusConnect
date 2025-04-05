// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCMCWDSVOE-yVBDE7qNQ1TSHai6p-R0zhk",
  authDomain: "campusconnect-69e3d.firebaseapp.com",
  projectId: "campusconnect-69e3d",
  storageBucket: "campusconnect-69e3d.firebasestorage.app",
  messagingSenderId: "1034860503384",
  appId: "1:1034860503384:web:ee4dade49f64258851452d",
  measurementId: "G-4BLKSXWQJ0"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Экспортируем объекты
export { auth, googleProvider, db };
