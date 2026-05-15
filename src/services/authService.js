import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Añadidos GoogleAuthProvider y signInWithPopup
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../config/constants";

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🚀 NUEVA FUNCIÓN: Login con Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Puedes forzar a que siempre pida seleccionar cuenta:
  // provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
};

export const logout = async () => {
  return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};