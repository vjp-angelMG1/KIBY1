import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges, logoutUser, db } from "../services/authService";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Contexto de autenticación de la aplicación.
 * Se inicializa en `null` y es proporcionado por el componente `AuthProvider`.
 * Contiene la información del usuario autenticado y los métodos de sesión.
 * 
 * @type {React.Context<{
 *   user: Object | null,
 *   loading: boolean,
 *   logout: Function
 * }>}
 */
const AuthContext = createContext(null);

/**
 * Proveedor de contexto de autenticación.
 * Envuelve la aplicación para proporcionar el estado de autenticación a todos los componentes hijos.
 * Gestiona la escucha de cambios de sesión de Firebase Auth y la sincronización del perfil con Firestore.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element} El proveedor de contexto con los valores de autenticación.
 */
export const AuthProvider = ({ children }) => {
  /** @type {[Object | null, Function]} Estado que almacena los datos del usuario autenticado o null si no lo está */
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  
  /** @type {[boolean, Function]} Estado que indica si la autenticación inicial está en curso */
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    /**
     * Se suscribe a los cambios de estado de autenticación de Firebase.
     * Cada vez que un usuario inicia o cierra sesión, este callback se ejecuta.
     * 
     * @param {Object} firebaseUser - El objeto de usuario de Firebase Auth, o null si cerró sesión.
     */
    const unsubscribeAuthListener = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userRole = 'user'; // Asumimos el rol por defecto
        let firestoreSynced = true; // Bandera para saber si la BD se sincronizó correctamente

        // 1. Intento de lectura del documento en Firestore
        try {
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // El documento existe, leemos el rol real de la base de datos
            userRole = userDocSnap.data()?.role || 'user';
          } else {
            // 2. El documento no existe (primera vez que entra), intentamos crearlo
            try {
              await setDoc(userDocRef, { 
                email: firebaseUser.email, 
                role: 'user', 
                purchases: [] 
              });
              userRole = 'user'; // Se acaba de crear con este rol por defecto
            } catch (createError) {
              console.error("Error creando el documento del usuario en Firestore:", createError);
              firestoreSynced = false; // La base de datos falló al crear
            }
          }
        } catch (readError) {
          console.error("Error leyendo el documento del usuario en Firestore:", readError);
          firestoreSynced = false; // La base de datos falló al leer
          // No intentamos crear el documento si la lectura falló, probablemente la BD esté caída o sin permisos
        }

        // Establecemos el usuario con el rol y el estado de sincronización
        setAuthenticatedUser({ 
          ...firebaseUser, 
          role: userRole, 
          firestoreSynced // Añadimos esta propiedad para que la app sepa si hubo fallo de conexión
        });

      } else {
        // El usuario cerró sesión
        setAuthenticatedUser(null);
      }
      
      // La carga inicial ha terminado, independientemente del resultado
      setIsAuthLoading(false);
    });

    // Cleanup: nos desuscribimos del listener cuando el componente se desmonta
    return () => unsubscribeAuthListener();
  }, []);

  /**
   * Maneja el cierre de sesión del usuario.
   * Delega la lógica de cierre de sesión al servicio de autenticación (`logoutUser`).
   * Al cerrar sesión, el listener de Firebase actualizará el estado a `null`.
   * 
   * @returns {void}
   */
  const handleLogout = () => { 
    logoutUser(); 
  };

  /**
   * Valor proporcionado a través del Contexto.
   * @typedef {Object} AuthContextValue
   * @property {Object | null} user - El objeto del usuario autenticado (contiene uid, email, role, firestoreSynced) o null.
   * @property {boolean} loading - Indica si el estado de autenticación se está verificando inicialmente.
   * @property {Function} logout - Función para cerrar la sesión del usuario actual.
   */

  return (
    <AuthContext.Provider value={{ user: authenticatedUser, loading: isAuthLoading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Facilita el acceso a la información del usuario, estado de carga y función de logout
 * sin necesidad de importar `useContext` y `AuthContext` en cada componente.
 * 
 * @returns {AuthContextValue} El valor actual del contexto de autenticación.
 * @throws {Error} Si se intenta usar fuera de un componente envuelto por `AuthProvider`.
 */
export const useAuth = () => useContext(AuthContext);