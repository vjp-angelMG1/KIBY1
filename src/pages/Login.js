import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
/**
 * Componente de Login.
 * Permite el acceso autenticado.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  /**
   * Maneja el envío del formulario.
   * @param {React.FormEvent} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError("Credenciales incorrectas o acceso denegado.");
    }
  };

  if (user) return null; 

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Kiby</h2>
        <p className="text-gray-500 mb-6">Plataforma de Formación</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" // Placeholder genérico
            className="w-full p-2 border rounded"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" // Placeholder genérico
            className="w-full p-2 border rounded"
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