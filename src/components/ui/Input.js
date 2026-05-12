import React from 'react';

/**
 * Componente Input reutilizable.
 * Maneja labels y estilos de formulario consistentes.
 */
const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false }) => {
  return (
    <div>
      {/* Mostrar etiqueta si existe */}
      {label && <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>}
      
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
      />
    </div>
  );
};

export default Input;