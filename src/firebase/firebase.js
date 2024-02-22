import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const apiKey = process.env.FIREBASE_API;

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