import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges, logout as authLogout, db } from "../services/authService";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      if (authUser) {
        // LÓGICA DINÁMICA: Leemos el rol real desde Firestore
        try {
          const snap = await getDoc(doc(db, 'users', authUser.uid));
          const role = snap.data()?.role || 'user';
          setUser({ ...authUser, role });
        } catch (error) {
          console.error("Error leyendo el rol:", error);
          setUser({ ...authUser, role: 'user' }); // Si falla, por seguridad es user
        }
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