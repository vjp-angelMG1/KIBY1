import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Cargando...</div>;
  }

  // Si no es admin, lo redirigimos a la tienda
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si es admin, le dejamos pasar
  return children;
};

export default ProtectedAdminRoute;