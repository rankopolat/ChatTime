import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "chat-time-bd554.firebaseapp.com",
  databaseURL: "https://chat-time-bd554-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-time-bd554",
  storageBucket: "chat-time-bd554.appspot.com",
  messagingSenderId: "40457461028",
  appId: "1:40457461028:web:8e26243d2e04ab630e27b1",
  measurementId: "G-Q9T1D141KZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth};