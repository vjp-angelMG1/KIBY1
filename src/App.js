import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import CouponManager from "./pages/CouponManager";
import AdminPanel from "./pages/AdminPanel";
import Button from "./components/ui/Button";
import { ModuleService } from "./services/dataService";

/**
 * Header de Navegación.
 * Controla qué ve el Admin vs el User y genera el Menú Dinámico.
 */
const Header = ({ currentView, setView, user, logout }) => {
  // LÓGICA DE MENÚ DINÁMICO: Leemos los módulos comprados
  const myModules = ModuleService.getMyModules();

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl text-indigo-600">Kiby</div>
        <nav className="flex gap-2 items-center">
          {/* --- VISTA ROL USER --- */}
          <Button variant={currentView === 'catalog' ? 'primary' : 'secondary'} onClick={() => setView('catalog')}>
            Catálogo
          </Button>
          <Button variant={currentView === 'coupons' ? 'primary' : 'secondary'} onClick={() => setView('coupons')}>
            Mis Cupones (User)
          </Button>
          
          {/* --- VISTA ROL ADMIN --- */}
          <Button variant={currentView === 'admin' ? 'primary' : 'secondary'} onClick={() => setView('admin')}>
            Panel Admin (CRUD)
          </Button>
          
          {/* --- SEPARADOR VISUAL --- */}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* --- MENÚ DINÁMICO (Items que aparecen al comprar) --- */}
          {myModules.map(m => (
            <button 
              key={m.id}
              onClick={() => setView('content', m)}
              className="px-3 py-1 text-sm font-bold bg-green-50 text-green-700 rounded hover:bg-green-100 transition border border-green-200 shadow-sm"
              title={`Acceder a ${m.title}`}
            >
              {m.title}
            </button>
          ))}

          <Button variant="danger" onClick={logout}>Salir</Button>
        </nav>
      </div>
    </header>
  );
};

/**
 * Componente Principal App.
 * Gestiona el enrutamiento y la simulación de pagos.
 */
export default function App() {
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState('catalog'); // catalog, coupons, admin, content
  const [selectedModule, setSelectedModule] = useState(null);
  const [dynamicMenuKey, setDynamicMenuKey] = useState(0); // Key para forzar re-render del Header

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando aplicación...</div>;
  if (!user) return <Login />;

  /**
   * SIMULACIÓN DE COMPRA.
   * Maneja la lógica de pago para módulos de pago con tiempo de espera.
   * @param {Module} module 
   */
  const handlePurchase = (module) => {
    // Lógica de confirmación
    const confirm = window.confirm(`¿Confirmar pago de ${module.price}€ por "${module.title}"?`);
    if (confirm) {
      // Simulación de proceso de pago (1.5 segundos)
      alert("Conectando con banco... Procesando tarjeta...");
      
      setTimeout(() => {
        // Transacción Exitosa
        ModuleService.addPurchase(module.id);
        
        // Actualizamos el menú dinámico
        setDynamicMenuKey(prev => prev + 1); 
        
        // Redirigimos al catálogo y recargamos para limpiar estado
        setView('catalog'); 
        window.location.reload(); 
      }, 1500);
    }
  };

  /**
   * Renderizador de Vistas.
   */
  const renderView = () => {
    switch(view) {
      case 'catalog': return <Catalog onPurchase={handlePurchase} />;
      case 'coupons': return <CouponManager />;
      case 'content': 
        return (
          <div className="text-center p-10 bg-white rounded shadow mt-10 border border-green-100">
            <div className="mb-4">
              <div className="inline-block p-4 bg-green-100 rounded-full text-green-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">{selectedModule?.title}</h1>
              <p className="mt-4 text-gray-600">Bienvenido al contenido premium.</p>
              <div className="mt-6 inline-block bg-gray-100 p-8 rounded text-gray-400 w-full max-w-lg mx-auto">
                [ REPRODUCTOR DE VIDEO DEL CURSO ]
              </div>
            </div>
          </div>
        );
      case 'admin': return <AdminPanel />;
      default: return <Catalog />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header 
        key={dynamicMenuKey} // La Key fuerza el re-render cuando compras algo
        currentView={view} 
        setView={(v, mod) => { setView(v); if(mod) setSelectedModule(mod); }} 
        user={user} 
        logout={logout} 
      />
      <main className="container mx-auto py-8">
        {renderView()}
      </main>
    </div>
  );
}