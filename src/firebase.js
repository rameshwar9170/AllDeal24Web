// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // ✅ Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH8p8tqt7MheTb2qX2vgejFqvrQ5i4sDA",
  authDomain: "alldeal24native.firebaseapp.com",
  databaseURL: "https://alldeal24native-default-rtdb.firebaseio.com",
  projectId: "alldeal24native",
  storageBucket: "alldeal24native.appspot.com",
  messagingSenderId: "832281003497",
  appId: "1:832281003497:web:113dd2aad1e8644071b778",
  measurementId: "G-T2G1FRJDE4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // ✅ Initialize Realtime Database

// ✅ Export what you need
export { database };
