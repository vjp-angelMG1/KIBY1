import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

import { FIREBASE_CONFIG } from "../config/constants";

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);

export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

// Ya no expulsamos a los usuarios normales, cualquiera puede loguearse
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};