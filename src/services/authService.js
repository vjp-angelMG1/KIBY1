import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges, logout as authLogout } from "../services/authService";
import { db } from "../services/authService"; // Importamos db
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      if (authUser) {
        // LÓGICA DINÁMICA: Leemos el rol real desde Firestore
        const snap = await getDoc(doc(db, 'users', authUser.uid));
        const role = snap.data()?.role || 'user';
        
        // Guardamos el usuario con su rol real
        setUser({ ...authUser, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => { authLogout(); };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);