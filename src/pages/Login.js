import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService"; // Asegúrate de que importa de authService
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await login(email, password); } 
    catch (err) { setError("Credenciales incorrectas o acceso denegado."); }
  };

  if (user) return null; 

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-[#bf522b]">Kiby</h2>
        <p className="text-gray-500 mb-6">Plataforma de Formación</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:border-[#bf522b] focus:outline-none transition"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:border-[#bf522b] focus:outline-none transition"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Iniciar Sesión</Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;