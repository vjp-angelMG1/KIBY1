import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"; // Añadido createUserWithEmailAndPassword
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../config/constants";

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🚀 NUEVA FUNCIÓN: Registro con Email y Contraseña
export const register = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = async () => {
  return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};