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
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userRole = 'user'; // Asumimos el rol por defecto
        let firestoreSynced = true; // Bandera para saber si la BD está sincronizada

        // 1. Intento de lectura del documento
        try {
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // El documento existe, leemos el rol real
            userRole = userDocSnap.data()?.role || 'user';
          } else {
            // 2. El documento no existe, intentamos crearlo
            try {
              await setDoc(userDocRef, { 
                email: firebaseUser.email, 
                role: 'user', 
                purchases: [] 
              });
              userRole = 'user'; // Se acaba de crear con este rol
            } catch (createError) {
              console.error("Error creando el documento del usuario en Firestore:", createError);
              firestoreSynced = false; // La base de datos falló al crear
            }
          }
        } catch (readError) { 
          console.error("Error leyendo el documento del usuario en Firestore:", readError);
          firestoreSynced = false; // La base de datos falló al leer
          // No intentamos crear el documento si la lectura falló, probablemente la BD esté caída
        }

        // Establecemos el usuario con el rol y el estado de sincronización
        setAuthenticatedUser({ 
          ...firebaseUser, 
          role: userRole, 
          firestoreSynced // Añadimos esta propiedad para que la app sepa si hubo fallo
        });

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