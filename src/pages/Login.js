import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginWithEmailPassword, loginWithGoogle, registerWithEmailPassword } from "../services/authService"; // Nombres actualizados
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import toast from 'react-hot-toast';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegisterMode) {
      // --- MODO REGISTRO ---
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        toast.error("Las contraseñas no coinciden");
        return;
      }
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        toast.error("Contraseña muy corta (mínimo 6 caracteres)");
        return;
      }

      try {
        await registerWithEmailPassword(email, password); // Función actualizada
        toast.success("¡Cuenta creada con éxito! Bienvenido.");
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          setError("Este correo electrónico ya está registrado.");
          toast.error("Correo ya registrado");
        } else {
          setError("Error al crear la cuenta. Inténtalo de nuevo.");
          toast.error("Error en el registro");
        }
      }
    } else {
      // --- MODO LOGIN ---
      try {
        await loginWithEmailPassword(email, password); // Función actualizada
        toast.success("Sesión iniciada correctamente");
      } catch (err) {
        setError("Credenciales incorrectas o acceso denegado.");
        toast.error("Error al iniciar sesión");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Sesión iniciada con Google");
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Error al iniciar sesión con Google.");
        toast.error("Error con Google");
      }
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  if (user) return null; 

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="p-8 w-full max-w-md text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-[#161616]">Kiby</h2>
          <p className="text-gray-500 mt-2">
            {isRegisterMode ? 'Crea tu cuenta para empezar' : 'Accede a tu cuenta'}
          </p>
        </div>

        {/* --- BOTÓN DE GOOGLE --- */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-semibold hover:bg-gray-50 hover:shadow-sm transition-all duration-300 mb-6 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isRegisterMode ? 'Registrarse con Google' : 'Continuar con Google'}
        </button>

        {/* --- SEPARADOR --- */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium uppercase tracking-wider">o</span>
          </div>
        </div>

        {/* --- FORMULARIO EMAIL/PASSWORD --- */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Correo electrónico</label>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf522b] focus:outline-none transition text-sm"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Contraseña</label>
            <input 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf522b] focus:outline-none transition text-sm"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          {/* --- CAMPO EXTRA SOLO EN MODO REGISTRO --- */}
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Confirmar Contraseña</label>
              <input 
                type="password" 
                placeholder="Repite tu contraseña" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf522b] focus:outline-none transition text-sm"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
              />
            </div>
          )}
          
          {error && <p className="text-red-500 text-sm pt-1 text-center">{error}</p>}
          
          <Button type="submit" className="w-full justify-center py-3">
            {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* --- ENLACE PARA CAMBIAR DE MODO --- */}
        <div className="mt-6 text-sm text-gray-500">
          {isRegisterMode ? (
            <p>¿Ya tienes una cuenta? <button onClick={toggleMode} className="text-[#bf522b] font-bold hover:underline">Inicia sesión</button></p>
          ) : (
            <p>¿No tienes cuenta? <button onClick={toggleMode} className="text-[#bf522b] font-bold hover:underline">Regístrate gratis</button></p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login;