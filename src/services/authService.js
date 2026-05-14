import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../config/constants";

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app); // Exportamos la base de datos

export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};