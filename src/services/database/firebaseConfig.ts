
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCM2bnIQ36YtsjlVP6VN5o8tERyhEQ8P9w",
    authDomain: "tennistracker-301ed.firebaseapp.com",
    projectId: "tennistracker-301ed",
    storageBucket: "tennistracker-301ed.firebasestorage.app",
    messagingSenderId: "144308428316",
    appId: "1:144308428316:web:745644d8fa33cf80d009d9"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
