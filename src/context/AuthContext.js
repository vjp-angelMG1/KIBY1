import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges, logout as authLogout, db } from "../services/authService";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Añadimos setDoc

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      if (authUser) {
        try {
          const userRef = doc(db, 'users', authUser.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            // Si la ficha ya existe, leemos el rol que tenga en la base de datos
            const role = snap.data()?.role || 'user';
            setUser({ ...authUser, role });
          } else {
            // Si la ficha NO existe (primera vez que entra), LA CREAMOS AUTOMÁTICAMENTE
            await setDoc(userRef, { 
              email: authUser.email, 
              role: 'user', 
              purchases: [] 
            });
            setUser({ ...authUser, role: 'user' });
          }
        } catch (error) {
          console.error("Error leyendo/creando el usuario:", error);
          setUser({ ...authUser, role: 'user' }); // Fallback por seguridad
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