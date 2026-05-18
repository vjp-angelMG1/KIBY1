import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../config/constants";

// Instancias en PascalCase
const FirebaseApp = initializeApp(FIREBASE_CONFIG);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseFirestore = getFirestore(FirebaseApp);

// Alias para compatibilidad con el resto del código actual
export const auth = FirebaseAuth;
export const db = FirebaseFirestore;

// Funciones en camelCase
export const loginWithEmailPassword = async (email, password) => {
  return signInWithEmailAndPassword(FirebaseAuth, email, password);
};

export const registerWithEmailPassword = async (email, password) => {
  return createUserWithEmailAndPassword(FirebaseAuth, email, password);
};

export const loginWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  return signInWithPopup(FirebaseAuth, googleProvider);
};

export const logoutUser = async () => {
  return signOut(FirebaseAuth);
};

export const subscribeToAuthChanges = (authStateCallback) => {
  return onAuthStateChanged(FirebaseAuth, authStateCallback);
};