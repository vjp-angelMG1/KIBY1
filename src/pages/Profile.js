import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ModuleService } from "../services/dataService";
import Button from "../components/ui/Button";

const Profile = ({ goToStore }) => {
  const { user, logout } = useAuth();
  const [myModules, setMyModules] = useState([]);

  useEffect(() => {
    const fetchMyMods = async () => {
      if (user?.uid) {
        const mods = await ModuleService.getMyModules(user.uid); // LEE COMPRAS DE LA NUBE
        setMyModules(mods);
      }
    };
    fetchMyMods();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#161616]">Mi Cuenta</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow text-center mb-6">
            <div className="w-24 h-24 bg-[#bf522b]/10 rounded-full mx-auto mb-4 flex items-center justify-center text-[#bf522b] text-4xl">👤</div>
            <h2 className="text-xl font-bold text-[#161616]">{user?.email}</h2>
            <p className="text-gray-500 mb-6 text-sm font-semibold uppercase bg-gray-100 inline-block px-3 py-1 rounded-full mt-2">
              {user?.role === 'admin' ? '👑 Administrador' : '🎓 Estudiante'}
            </p>
            <Button onClick={goToStore} className="w-full mb-3">🛒 Ir a la Tienda</Button>
          </div>
          <Button variant="danger" className="w-full" onClick={logout}>Cerrar Sesión</Button>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-[#161616] pb-2">📚 Mis Módulos Comprados</h3>
          {myModules.length === 0 ? (
            <div className="text-gray-400 text-center py-8 bg-white rounded-lg border">Aún no tienes módulos.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myModules.map(m => (
                <div key={m.id} className="flex items-center bg-white p-3 rounded-lg border shadow-sm">
                  <div className="font-bold text-[#161616]">{m.title}</div>
                  <div className="ml-auto text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">✅ ADQUIRIDO</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;