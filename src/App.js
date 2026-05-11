import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import CouponManager from "./pages/CouponManager";
import Button from "./components/ui/Button";
import { ModuleService } from "./services/dataService";



const Header = ({ currentView, setView, user, logout }) => {
  const myModules = ModuleService.getMyModules();

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl text-indigo-600">Kiby</div>
        <nav className="flex gap-2 items-center">
          <Button 
            variant={currentView === 'catalog' ? 'primary' : 'secondary'} 
            onClick={() => setView('catalog')}
          >
            Catálogo
          </Button>
          <Button 
            variant={currentView === 'coupons' ? 'primary' : 'secondary'} 
            onClick={() => setView('coupons')}
          >
            Cupones
          </Button>
          <Button 
            variant={currentView === 'admin' ? 'primary' : 'secondary'} 
            onClick={() => setView('admin')}
          >
            Admin
          </Button>
          
          {}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          {myModules.map(m => (
            <button 
              key={m.id}
              onClick={() => setView('content', m)}
              className="px-3 py-1 text-sm font-bold bg-green-50 text-green-700 rounded hover:bg-green-100 transition"
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

export default function App() {
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState('catalog'); 
  const [selectedModule, setSelectedModule] = useState(null);

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!user) return <Login />;

  const handlePurchase = (module) => {
    const confirm = window.confirm(`¿Pagar ${module.price}€ por ${module.title}?`);
    if (confirm) {
      setTimeout(() => {
        ModuleService.addPurchase(module.id);
        setView('catalog'); 
        window.location.reload(); 
      }, 1000);
    }
  };

  const renderView = () => {
    switch(view) {
      case 'catalog': return <Catalog onPurchase={handlePurchase} />;
      case 'coupons': return <CouponManager />;
      case 'content': 
        return (
          <div className="text-center p-10 bg-white rounded shadow mt-10">
            <h1 className="text-3xl font-bold">{selectedModule?.title}</h1>
            <p className="mt-4 text-gray-600">Reproduciendo contenido del curso...</p>
          </div>
        );
      case 'admin': return <div className="p-10 bg-white">Aquí iría el Panel de Admin (Tabla CRUD)</div>;
      default: return <Catalog />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header 
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
