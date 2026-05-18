import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges, logoutUser, db } from "../services/authService";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuthListener = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userRole = userDocSnap.data()?.role || 'user';
            setAuthenticatedUser({ ...firebaseUser, role: userRole });
          } else {
            // Crear ficha en Firestore si es la primera vez que entra
            await setDoc(userDocRef, { 
              email: firebaseUser.email, 
              role: 'user', 
              purchases: [] 
            });
            setAuthenticatedUser({ ...firebaseUser, role: 'user' });
          }
        } catch (error) {
          console.error("Error leyendo/creando el usuario:", error);
          setAuthenticatedUser({ ...firebaseUser, role: 'user' });
        }
      } else {
        setAuthenticatedUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribeAuthListener();
  }, []);

  const handleLogout = () => { logoutUser(); };

  return (
    <AuthContext.Provider value={{ user: authenticatedUser, loading: isAuthLoading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);