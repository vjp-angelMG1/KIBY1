import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
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
import toast, { Toaster } from 'react-hot-toast';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-300">Cargando permisos...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const Header = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="bg-[#161616] dark:bg-gray-950 shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl text-[#bf522b] cursor-pointer" onClick={() => { navigate('/'); closeMenu(); }}>Kiby</div>
        
        {/* Botón Hamburguesa (Móvil/Tablet) */}
        <button 
          className="md:hidden text-white text-3xl focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Menú Escritorio */}
        <nav className="hidden md:flex gap-2 items-center flex-wrap">
          {/* 👇 Se añadió dark:text-white a los botones 👇 */}
          <Link to="/">
            <Button variant={location.pathname === '/' ? 'primary' : 'secondary'} className={`${location.pathname === '/' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
              Tienda
            </Button>
          </Link>
          <Link to="/cupones">
            <Button variant={location.pathname === '/cupones' ? 'primary' : 'secondary'} className={`${location.pathname === '/cupones' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
              Cupones
            </Button>
          </Link>
          <Link to="/perfil">
            <Button variant={location.pathname === '/perfil' ? 'primary' : 'secondary'} className={`${location.pathname === '/perfil' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
              Mi Cuenta
            </Button>
          </Link>
          {isAdmin && 
            <Link to="/admin">
              <Button variant={location.pathname === '/admin' ? 'primary' : 'secondary'} className={`${location.pathname === '/admin' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
                Panel Admin
              </Button>
            </Link>
          }
          <Button variant="secondary" onClick={toggleDarkMode} className="text-[#bf522b] dark:text-white">
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </Button>
          <Button variant="danger" onClick={logout} className="text-white dark:text-white">Salir</Button>
        </nav>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col w-full gap-3 mt-4 pt-4 border-t border-gray-800 dark:border-gray-700">
          {/* 👇 Se añadió dark:text-white a los botones móviles 👇 */}
          <Link to="/" onClick={closeMenu}>
            <Button variant={location.pathname === '/' ? 'primary' : 'secondary'} className={`w-full ${location.pathname === '/' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
              Tienda
            </Button>
          </Link>
          <Link to="/cupones" onClick={closeMenu}>
            <Button variant={location.pathname === '/cupones' ? 'primary' : 'secondary'} className={`w-full ${location.pathname === '/cupones' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
              Cupones
            </Button>
          </Link>
          <Link to="/perfil" onClick={closeMenu}>
            <Button variant={location.pathname === '/perfil' ? 'primary' : 'secondary'} className={`w-full ${location.pathname === '/perfil' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
              Mi Cuenta
            </Button>
          </Link>
          {isAdmin && 
            <Link to="/admin" onClick={closeMenu}>
              <Button variant={location.pathname === '/admin' ? 'primary' : 'secondary'} className={`w-full ${location.pathname === '/admin' ? 'text-white' : 'text-[#bf522b]'} dark:text-white`}>
                Panel Admin
              </Button>
            </Link>
          }
          <Button variant="secondary" onClick={() => { toggleDarkMode(); }} className="w-full text-[#bf522b] dark:text-white">
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </Button>
          <Button variant="danger" onClick={handleLogout} className="w-full text-white dark:text-white">Salir</Button>
        </nav>
      )}
    </header>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#161616] dark:bg-gray-950 text-gray-300 dark:text-gray-200 py-8 mt-auto border-t border-gray-800 dark:border-gray-800">
      <div className="container mx-auto px-4 flex flex-col justify-center items-center text-center gap-6">
        <div>
          <p className="text-sm text-gray-400 dark:text-gray-300">© {currentYear} Kiby. Todos los derechos reservados.</p>
          <p className="text-xs mt-1">
            Hecho por <span className="text-[#bf522b] font-bold hover:underline">Ángel Montero Gregorio</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a href="#" className="hover:text-[#bf522b] dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">Política de Privacidad</a>
          <a href="#" className="hover:text-[#bf522b] dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">Términos y Condiciones</a>
          <a href="#" className="hover:text-[#bf522b] dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">Política de Cookies</a>
          <a href="#" className="hover:text-[#bf522b] dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">Contacto</a>
        </div>
      </div>
    </footer>
  );
};


export default function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate(); 
  const [selectedModule, setSelectedModule] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-300">Cargando aplicación...</div>;
  if (!user) return <Login />;

  const handlePurchase = async (module) => {
    await ModuleService.addPurchase(user.uid, module.id);
    toast.success("¡Pago completado! El módulo es tuyo.");
    navigate('/perfil'); 
  };

  const goToCheckout = (module) => {
    setSelectedModule(module);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen aurora-bg dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { background: '#161616', color: '#fff', borderRadius: '12px' }, 
          success: { iconTheme: { primary: '#bf522b', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }} 
      />
      
      <main className="container mx-auto py-8 flex-grow">
        <Routes>
          <Route path="/" element={<Catalog goToCheckout={goToCheckout} isAdmin={user?.role === 'admin'} userPurchases={user.purchases || []} />} />
          <Route path="/cupones" element={<CouponManager isAdmin={user?.role === 'admin'} />} />
          <Route path="/perfil" element={<Profile goToStore={() => navigate('/')} />} />
          <Route path="/checkout" element={<Checkout module={selectedModule} onPurchase={handlePurchase} goBack={() => navigate('/')} />} />
          <Route path="/curso" element={<ModuleDetail module={selectedModule} />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}