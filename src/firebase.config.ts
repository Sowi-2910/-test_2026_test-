import { initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBasn0XHDv3IT7ZNW6slfcj8EIEIIa-c_A",
  authDomain: "torres-y-torres-c91fc.firebaseapp.com",
  projectId: "torres-y-torres-c91fc",
  storageBucket: "torres-y-torres-c91fc.firebasestorage.app",
  messagingSenderId: "378569975845",
  appId: "1:378569975845:web:78ad143e30d85d3ca777cc",
  measurementId: "G-7N7K1DTNNL"
};

// Check if the user has updated the config
export const isConfigured = firebaseConfig.apiKey !== "REPLACE_WITH_YOUR_API_KEY" && firebaseConfig.apiKey !== "";

export const app = initializeApp(firebaseConfig);
export const auth = firebaseAuth.getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code == 'unimplemented') {
    console.warn('Firestore persistence not supported by browser');
  }
});