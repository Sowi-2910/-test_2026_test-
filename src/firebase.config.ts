
import { initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// --- CONFIGURATION REQUIRED ---
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or select existing)
// 3. Go to Project Settings > General > Your apps > Web app
// 4. Copy the firebaseConfig object
// 5. Replace the object below with your actual credentials

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

// Fix: Enable offline persistence to handle connectivity issues gracefully
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn('Firestore persistence not supported by browser');
  }
});
