import { initializeApp } from 'firebase/app';
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

let app;
let firestore;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

export { firestore };
