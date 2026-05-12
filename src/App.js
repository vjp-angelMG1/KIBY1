import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import CouponManager from "./pages/CouponManager";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout"; // NUEVO IMPORT
import Button from "./components/ui/Button";
import { APP_CONFIG } from "./config/constants";
import { ModuleService } from "./services/dataService";

const Header = ({ currentView, setView, user, logout, isAdmin }) => {
  const myModules = ModuleService.getMyModules();

  return (
    <header className="bg-[#161616] shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl text-[#bf522b]">Kiby</div>
        <nav className="flex gap-2 items-center flex-wrap">
          
          <Button variant={currentView === 'catalog' ? 'primary' : 'secondary'} onClick={() => setView('catalog')}>
            Tienda
          </Button>
          
          {!isAdmin && (
            <Button variant={currentView === 'coupons' ? 'primary' : 'secondary'} onClick={() => setView('coupons')}>
              Cupones
            </Button>
          )}

          <Button variant={currentView === 'profile' ? 'primary' : 'secondary'} onClick={() => setView('profile')}>
            Mi Cuenta
          </Button>
          
          {isAdmin && (
            <Button variant={currentView === 'admin' ? 'primary' : 'secondary'} onClick={() => setView('admin')}>
              Panel Admin
            </Button>
          )}
          
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          
          {myModules.map(m => (
            <button 
              key={m.id}
              onClick={() => setView('content', m)}
              className="px-3 py-1 text-sm font-bold bg-[#bf522b]/10 text-[#bf522b] rounded hover:bg-[#bf522b]/20 transition border border-[#bf522b]/30 shadow-sm"
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
  const [dynamicMenuKey, setDynamicMenuKey] = useState(0);

  const isAdmin = user?.email === APP_CONFIG.ADMIN_EMAIL;

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando aplicación...</div>;
  if (!user) return <Login />;

  const handlePurchase = (module) => {
    ModuleService.addPurchase(module.id);
    setDynamicMenuKey(Date.now()); 
    setView('profile'); // Tras comprar, llevamos al usuario a su cuenta para que vea el curso
  };

  // Función para ir al checkout
  const goToCheckout = (module) => {
    setSelectedModule(module);
    setView('checkout');
  };

  const renderView = () => {
    switch(view) {
      case 'catalog': 
        return <Catalog goToCheckout={goToCheckout} refreshKey={dynamicMenuKey} isAdmin={isAdmin} />;
      case 'coupons': 
        return <CouponManager isAdmin={isAdmin} />;
      case 'admin': 
        return isAdmin ? <AdminPanel /> : <Catalog goToCheckout={goToCheckout} refreshKey={dynamicMenuKey} isAdmin={isAdmin} />;
      case 'profile': 
        return <Profile goToStore={() => setView('catalog')} />;
      case 'checkout': 
        return <Checkout module={selectedModule} onPurchase={handlePurchase} goBack={() => setView('catalog')} />;
      case 'content': 
        return (
          <div className="text-center p-10 bg-white rounded shadow mt-10 border border-gray-100">
            <div className="mb-4">
              <div className="inline-block p-4 bg-[#bf522b]/10 rounded-full text-[#bf522b] mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h1 className="text-3xl font-bold text-[#161616]">{selectedModule?.title}</h1>
              <p className="mt-4 text-gray-600">Bienvenido al contenido premium.</p>
              <div className="mt-6 inline-block bg-gray-100 p-8 rounded text-gray-400 w-full max-w-lg mx-auto">[ REPRODUCTOR DE VIDEO ]</div>
            </div>
          </div>
        );
      default: 
        return <Catalog goToCheckout={goToCheckout} refreshKey={dynamicMenuKey} isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header 
        key={dynamicMenuKey}
        currentView={view} 
        setView={(v, mod) => { setView(v); if(mod) setSelectedModule(mod); }} 
        user={user} 
        logout={logout} 
        isAdmin={isAdmin}
      />
      <main className="container mx-auto py-8">
        {renderView()}
      </main>
    </div>
  );
}