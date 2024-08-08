import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBuSZjKgQOjIMADAQo6jRFsxvM8G3nMQvA",
    authDomain: "inventory-managment-24700.firebaseapp.com",
    projectId: "inventory-managment-24700",
    storageBucket: "inventory-managment-24700.appspot.com",
    messagingSenderId: "745017846356",
    appId: "1:745017846356:web:8e043bd738a6e4e2169bc1",
    measurementId: "G-WTL4WDW5G7"
  };
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };