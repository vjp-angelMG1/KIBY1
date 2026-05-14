import React, { useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom"; // Quitado BrowserRouter
import { useAuth } from "./context/AuthContext";
import { ModuleService } from "./services/dataService";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import CouponManager from "./pages/CouponManager";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import ModuleDetail from "./pages/ModuleDetail";
import Button from "./components/ui/Button";

// EL GUARDIÁN AHORA ESTÁ AQUÍ DENTRO
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Cargando permisos...</div>;
  }

  // Si no es admin, lo echamos a la tienda
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si es admin, le dejamos pasar
  return children;
};

// Header adaptado a React Router
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin'; // Leído dinámicamente de la BD

  return (
    <header className="bg-[#161616] shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl text-[#bf522b] cursor-pointer" onClick={() => navigate('/')}>Kiby</div>
        <nav className="flex gap-2 items-center flex-wrap">
          <Link to="/"><Button variant={window.location.pathname === '/' ? 'primary' : 'secondary'}>Tienda</Button></Link>
          {!isAdmin && <Link to="/cupones"><Button variant={window.location.pathname === '/cupones' ? 'primary' : 'secondary'}>Cupones</Button></Link>}
          <Link to="/perfil"><Button variant={window.location.pathname === '/perfil' ? 'primary' : 'secondary'}>Mi Cuenta</Button></Link>
          {isAdmin && <Link to="/admin"><Button variant={window.location.pathname === '/admin' ? 'primary' : 'secondary'}>Panel Admin</Button></Link>}
          <Button variant="danger" onClick={logout}>Salir</Button>
        </nav>
      </div>
    </header>
  );
};

export default function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate(); // Hook para redirigir programáticamente
  const [selectedModule, setSelectedModule] = useState(null);

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando aplicación...</div>;
  if (!user) return <Login />;

  const handlePurchase = async (module) => {
    await ModuleService.addPurchase(user.uid, module.id);
    alert("✅ Pago completado. El módulo es tuyo.");
    navigate('/perfil'); // Redirigimos al perfil tras comprar
  };

  // Función para ir al checkout y redirigir la ruta
  const goToCheckout = (module) => {
    setSelectedModule(module);
    navigate('/checkout');
  };

  return (
    // BrowserRouter eliminado de aquí
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="container mx-auto py-8">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Catalog goToCheckout={goToCheckout} isAdmin={user?.role === 'admin'} userPurchases={user.purchases || []} />} />
          <Route path="/cupones" element={<CouponManager isAdmin={user?.role === 'admin'} />} />
          <Route path="/perfil" element={<Profile goToStore={() => navigate('/')} />} />
          <Route path="/checkout" element={<Checkout module={selectedModule} onPurchase={handlePurchase} goBack={() => navigate('/')} />} />
          <Route path="/curso" element={<ModuleDetail module={selectedModule} />} />
          
          {/* RUTA PROTEGIDA: Solo Admins */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          } />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}