import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

import { FIREBASE_CONFIG, APP_CONFIG } from "../config/constants";

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);

export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && user.email !== APP_CONFIG.ADMIN_EMAIL) {
      // Seguridad: Forzar logout si no es el usuario permitido
      signOut(auth);
      callback(null); 
    } else {
      callback(user);
    }
  });
};