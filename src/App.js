import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { ModuleService } from "./services/dataService"; // ¡ESTA LÍNEA ES LA QUE FALTA!
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import CouponManager from "./pages/CouponManager";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import ModuleDetail from "./pages/ModuleDetail";
import Button from "./components/ui/Button";

const Header = ({ currentView, setView, user, logout }) => {
  // EL ROL AHORA VIENE DE LA BASE DE DATOS
  const isAdmin = user?.role === 'admin'; 

  return (
    <header className="bg-[#161616] shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl text-[#bf522b]">Kiby</div>
        <nav className="flex gap-2 items-center flex-wrap">
          <Button variant={currentView === 'catalog' ? 'primary' : 'secondary'} onClick={() => setView('catalog')}>Tienda</Button>
          {!isAdmin && <Button variant={currentView === 'coupons' ? 'primary' : 'secondary'} onClick={() => setView('coupons')}>Cupones</Button>}
          <Button variant={currentView === 'profile' ? 'primary' : 'secondary'} onClick={() => setView('profile')}>Mi Cuenta</Button>
          {isAdmin && <Button variant={currentView === 'admin' ? 'primary' : 'secondary'} onClick={() => setView('admin')}>Panel Admin</Button>}
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

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando aplicación...</div>;
  if (!user) return <Login />;

  const isAdmin = user?.email === 'admin@kiby.com';

  const handlePurchase = async (module) => {
    await ModuleService.addPurchase(user.uid, module.id);
    alert("✅ Pago completado. El módulo es tuyo.");
    setView('profile');
  };

  const goToCheckout = (module) => {
    setSelectedModule(module);
    setView('checkout');
  };

  const renderView = () => {
    switch(view) {
      case 'catalog': 
        return <Catalog goToCheckout={goToCheckout} isAdmin={isAdmin} userPurchases={user.purchases || []} />;
      case 'coupons': 
        return <CouponManager isAdmin={isAdmin} />;
      case 'admin': 
        return isAdmin ? <AdminPanel /> : <Catalog goToCheckout={goToCheckout} isAdmin={isAdmin} userPurchases={user.purchases || []} />;
      case 'profile': 
        return <Profile goToStore={() => setView('catalog')} />;
      case 'checkout': 
        return <Checkout module={selectedModule} onPurchase={handlePurchase} goBack={() => setView('catalog')} />;
      case 'content': 
        return <ModuleDetail module={selectedModule} />;
      default: 
        return <Catalog goToCheckout={goToCheckout} isAdmin={isAdmin} userPurchases={user.purchases || []} />;
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