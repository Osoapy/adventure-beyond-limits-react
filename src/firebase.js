// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDSPuVOSl6qK0_masCfZIczpFuNesdWvLA",
    authDomain: "pokemonadventuresbeyondlimits.firebaseapp.com",
    projectId: "pokemonadventuresbeyondlimits",
    storageBucket: "pokemonadventuresbeyondlimits.firebasestorage.app",
    messagingSenderId: "1091974981674",
    appId: "1:1091974981674:web:f4e92002c20b2870c43b53"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Exporta a instância de autenticação
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
