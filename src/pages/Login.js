import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth(); // Redirección simple controlada

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  if (user) return null; // El Router en App.jsx se encarga de redirigir

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Kiby Login</h2>
        <p className="text-gray-500 mb-6">Acceso restringido</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="admin@kiby.com" 
            className="w-full p-2 border rounded"
            value={email} onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="123456" 
            className="w-full p-2 border rounded"
            value={password} onChange={(e) => setPassword(e.target.value)} 
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">ENTRAR</Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;