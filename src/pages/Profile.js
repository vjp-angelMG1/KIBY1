import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ModuleService } from "../services/dataService";
import { CouponService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Profile = () => {
  const { user } = useAuth();
  const [myModules, setMyModules] = useState([]);
  const [myCoupons, setMyCoupons] = useState([]);

  useEffect(() => {
    setMyModules(ModuleService.getMyModules());
    setMyCoupons(CouponService.getAll());
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: INFO USUARIO */}
        <div className="lg:col-span-1">
          <Card className="p-6 text-center mb-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center text-indigo-600 text-4xl">
                👤
            </div>
            <h2 className="text-xl font-bold">{user?.email}</h2>
            <p className="text-gray-500 mb-4">Miembro desde: {new Date().toLocaleDateString()}</p>
            <div className="text-left bg-gray-50 p-4 rounded text-sm">
              <p className="font-bold mb-2">Resumen:</p>
              <p>💰 {myModules.length} Módulos activos</p>
              <p>🎫 {myCoupons.length} Cupones creados</p>
            </div>
          </Card>
          
          <Button variant="danger" className="w-full">Cerrar Sesión</Button>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECCIÓN MÓDULOS */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Mis Módulos (Historial)</h3>
            {myModules.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No tienes módulos activos.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myModules.map(m => (
                  <div key={m.id} className="flex items-center bg-white p-3 rounded border shadow-sm">
                    <img src={m.img} className="w-12 h-12 rounded mr-4 object-cover" />
                    <div>
                      <div className="font-bold">{m.title}</div>
                      <div className="text-xs text-green-600 font-bold">ADQUIRIDO</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN CUPONES */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Mis Cupones Activos</h3>
            {myCoupons.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No has creado cupones.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCoupons.map(c => (
                  <div key={c.id} className="bg-white p-3 rounded border shadow-sm flex justify-between items-center">
                    <div className="font-mono font-bold">{c.code}</div>
                    <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">-{c.discount}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;