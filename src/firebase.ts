import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA80bxEBP0XvTnKap5bgamWGqB7_3orIxw",
  authDomain: "savora-e2681.firebaseapp.com",
  projectId: "savora-e2681",
  storageBucket: "savora-e2681.firebasestorage.app",
  messagingSenderId: "155396563008",
  appId: "1:155396563008:web:c93c3f174d178631103fa5",
  measurementId: "G-W31BX072Q0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
