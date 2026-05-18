import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ModuleService } from "../services/dataService";
import toast from 'react-hot-toast';
import Button from "../components/ui/Button";

const UserProfile = ({ goToStore }) => {
  const { user, logout } = useAuth();
  const [myModules, setMyModules] = useState([]);

  useEffect(() => {
    const fetchUserModules = async () => {
      if (user?.uid) {
        const modules = await ModuleService.getMyModules(user.uid);
        setMyModules(modules);
      }
    };
    fetchUserModules();
  }, [user]);

  const handleLogoutAndNotify = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#161616] dark:text-white tracking-tight">Mi Cuenta</h1>
        <Button variant="danger" onClick={handleLogoutAndNotify} className="text-white">Cerrar Sesión</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center mb-6 border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-[#bf522b]/10 rounded-full mx-auto mb-4 flex items-center justify-center text-[#bf522b] text-4xl">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
            </div>
            
            <h2 className="text-xl font-bold text-[#161616] dark:text-white">{user?.fullName || user?.email}</h2>
            
            {user?.username && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">@{user.username}</p>}
            {user?.phone && <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">📞 {user.phone}</p>}
            
            {!user?.username && <p className="text-gray-500 mb-6 text-sm font-semibold uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 inline-block px-3 py-1 rounded-full mt-2">🎓 Estudiante</p>}
            
            {/* 👇 Botón en NARANJA 👇 */}
            <Button onClick={goToStore} className="w-full mb-3 text-[#bf522b]">🛒 Ir a la Tienda</Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-[#161616] dark:border-white pb-2 dark:text-white">📚 Mis Módulos</h3>
          {myModules.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 mt-2">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-[#161616] dark:text-white mb-2">Tu viaje comienza aquí</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">Aún no has adquirido ningún módulo. ¡Explora nuestro catálogo y empieza a aprender!</p>
              {/* 👇 Botón en NARANJA 👇 */}
              <Button onClick={goToStore} className="text-[#bf522b]">Explorar Tienda</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {myModules.map(moduleItem => (
                <div key={moduleItem.id} className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="font-bold text-[#161616] dark:text-white">{moduleItem.title}</div>
                  <div className="ml-auto text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">✅ ADQUIRIDO</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;