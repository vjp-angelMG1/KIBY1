import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ModuleService } from "../services/dataService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import toast from 'react-hot-toast';

const AdminDashboard = ({ goToStore }) => {
  const { user, logout } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({ totalModules: 0, topModules: [] });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const allModules = await ModuleService.getAll();
      const modulesWithBuyers = await Promise.all(allModules.map(async (moduleItem) => {
        const buyerEmails = await ModuleService.getBuyersForModule(moduleItem.id);
        return { ...moduleItem, buyerCount: buyerEmails.length };
      }));
      const sortedTopModules = modulesWithBuyers.sort((moduleA, moduleB) => moduleB.buyerCount - moduleA.buyerCount).slice(0, 5);
      setDashboardStats({ totalModules: allModules.length, topModules: sortedTopModules });
    };
    fetchDashboardStats();
  }, []);

  const simulatedMonthlySales = [
    { month: 'Ene', sales: 12 }, { month: 'Feb', sales: 19 },
    { month: 'Mar', sales: 25 }, { month: 'Abr', sales: 15 },
    { month: 'May', sales: 42 }, { month: 'Jun', sales: 38 },
  ];
  const maxSimulatedSales = Math.max(...simulatedMonthlySales.map(saleData => saleData.sales));

  const handleLogoutAndNotify = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">Dashboard de Administración</h1>
          <p className="text-gray-500 mt-1">Resumen de la plataforma y rendimiento.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={goToStore}>🛒 Ver Tienda</Button>
          <Button variant="danger" onClick={handleLogoutAndNotify}>Cerrar Sesión</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="p-6 bg-gradient-to-br from-[#161616] to-gray-800 text-white">
          <p className="text-gray-400 text-sm font-semibold mb-1">Módulos Publicados</p>
          <p className="text-4xl font-extrabold">{dashboardStats.totalModules}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-[#bf522b] to-orange-700 text-white">
          <p className="text-orange-100 text-sm font-semibold mb-1">Ingresos Estimados (Mes)</p>
          <p className="text-4xl font-extrabold">2.450€</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-[#bf522b]">
          <p className="text-gray-500 text-sm font-semibold mb-1">Tasa de Conversión</p>
          <p className="text-4xl font-extrabold text-[#161616]">8.5%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <h3 className="text-xl font-bold text-[#161616] mb-6">Repuntes de Ventas (Últimos 6 meses)</h3>
            <div className="flex items-end justify-between gap-4 h-48 pt-6 border-b border-gray-200">
              {simulatedMonthlySales.map((saleData, chartIndex) => (
                <div key={chartIndex} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: '100%' }}>
                    <div className="absolute bottom-0 w-full bg-[#bf522b] rounded-t-lg transition-all duration-500 ease-out group-hover:bg-[#a3441f]" style={{ height: `${(saleData.sales / maxSimulatedSales) * 100}%` }}></div>
                  </div>
                  <span className="mt-2 text-xs font-bold text-gray-500">{saleData.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <h3 className="text-xl font-bold text-[#161616] mb-6">🔥 Top Módulos Vendidos</h3>
            <div className="space-y-4">
              {dashboardStats.topModules.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Aún no hay ventas.</p>
              ) : (
                dashboardStats.topModules.map((moduleItem, rankingPosition) => (
                  <div key={moduleItem.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="w-8 h-8 bg-[#bf522b] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{rankingPosition + 1}</div>
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold text-[#161616] text-sm truncate">{moduleItem.title}</p>
                      <p className="text-xs text-gray-500">{moduleItem.buyerCount} compras</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const UserProfile = ({ goToStore }) => {
  const { user, logout } = useAuth();
  const [purchasedModules, setPurchasedModules] = useState([]);

  useEffect(() => {
    const fetchUserModules = async () => {
      if (user?.uid) {
        const modules = await ModuleService.getMyModules(user.uid);
        setPurchasedModules(modules);
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
        <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">Mi Cuenta</h1>
        <Button variant="danger" onClick={handleLogoutAndNotify}>Cerrar Sesión</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow text-center mb-6 border border-gray-100">
            <div className="w-24 h-24 bg-[#bf522b]/10 rounded-full mx-auto mb-4 flex items-center justify-center text-[#bf522b] text-4xl">👤</div>
            <h2 className="text-xl font-bold text-[#161616]">{user?.email}</h2>
            <p className="text-gray-500 mb-6 text-sm font-semibold uppercase bg-gray-100 inline-block px-3 py-1 rounded-full mt-2">🎓 Estudiante</p>
            <Button onClick={goToStore} className="w-full mb-3">🛒 Ir a la Tienda</Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-[#161616] pb-2">📚 Mis Módulos</h3>
          {purchasedModules.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 mt-2">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-[#161616] mb-2">Tu viaje comienza aquí</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Aún no has adquirido ningún módulo. ¡Explora nuestro catálogo y empieza a aprender!</p>
              <Button onClick={goToStore}>Explorar Tienda</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {purchasedModules.map(moduleItem => (
                <div key={moduleItem.id} className="flex items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <div className="font-bold text-[#161616]">{moduleItem.title}</div>
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

export default function Profile({ goToStore }) {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <AdminDashboard goToStore={goToStore} />;
  }
  return <UserProfile goToStore={goToStore} />;
}