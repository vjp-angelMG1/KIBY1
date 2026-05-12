import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ModuleService } from "../services/dataService";
import { CouponService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Profile = ({ goToStore }) => {
  const { user, logout } = useAuth();
  const [myModules, setMyModules] = useState([]);
  const [activeCoupons, setActiveCoupons] = useState([]);

  useEffect(() => {
    setMyModules(ModuleService.getMyModules());
    setActiveCoupons(CouponService.getAll().filter(c => c.active));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#161616]">Mi Cuenta</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: INFO USUARIO */}
        <div className="lg:col-span-1">
          <Card className="p-6 text-center mb-6">
            <div className="w-24 h-24 bg-[#bf522b]/10 rounded-full mx-auto mb-4 flex items-center justify-center text-[#bf522b] text-4xl">👤</div>
            <h2 className="text-xl font-bold text-[#161616]">{user?.email}</h2>
            <p className="text-gray-500 mb-6 text-sm">Rol: {user?.email === 'admin@kiby.com' ? 'Administrador' : 'Estudiante'}</p>
            
            <Button onClick={goToStore} className="w-full mb-3">
              🛒 Ir a la Tienda
            </Button>

            <div className="text-left bg-gray-50 p-4 rounded-lg text-sm mt-4 space-y-1">
              <p className="font-bold mb-2 text-[#161616] border-b pb-1">Resumen:</p>
              <p>📚 {myModules.length} Módulos comprados</p>
              <p>🎫 {activeCoupons.length} Cupones disponibles</p>
            </div>
          </Card>
          
          <Button variant="danger" className="w-full" onClick={logout}>Cerrar Sesión</Button>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECCIÓN MÓDULOS COMPRADOS */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-[#161616] pb-2">📚 Mis Módulos Comprados</h3>
            {myModules.length === 0 ? (
              <div className="text-gray-400 text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                Aún no tienes módulos. <span onClick={goToStore} className="text-[#bf522b] cursor-pointer hover:underline font-bold">¡Compra uno ahora!</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myModules.map(m => (
                  <div key={m.id} className="flex items-center bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition">
                    <div className="w-14 h-14 rounded-lg mr-4 overflow-hidden bg-[#161616] flex items-center justify-center flex-shrink-0">
                      <img src={m.img} className="w-full h-full object-cover" alt={m.title} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                      <span className="hidden text-[#bf522b] font-bold text-sm">{m.title.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#161616]">{m.title}</div>
                      <div className="text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded mt-1">✅ ADQUIRIDO</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN CUPONES DISPONIBLES */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-[#161616] pb-2">🎫 Mis Cupones Disponibles</h3>
            {activeCoupons.length === 0 ? (
              <div className="text-gray-400 text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                No hay cupones activos ahora mismo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCoupons.map(c => (
                  <div key={c.id} className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-center border-dashed border-[#bf522b]/30 bg-[#bf522b]/5">
                    <div>
                      <span className="font-mono font-bold text-[#161616] tracking-widest">{c.code}</span>
                      <p className="text-xs text-gray-500 mt-1">Úsalo en tu próxima compra</p>
                    </div>
                    <div className="bg-[#bf522b]/10 text-[#bf522b] px-3 py-1 rounded-md text-sm font-bold">-{c.discount}%</div>
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