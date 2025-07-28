import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLp1m5D98gWP6OiAXjXbRHGpCY0dx5ZM8",
  authDomain: "filmyverse-65724.firebaseapp.com",
  projectId: "filmyverse-65724",
  storageBucket: "filmyverse-65724.appspot.com",
  messagingSenderId: "309412779497",
  appId: "1:309412779497:web:f783499e15c981d1436778",
  measurementId: "G-MYR53X0ZMW",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const moviesRef = collection(db, "movies"); // Movies collection that we have created in Firebase
export default app;
