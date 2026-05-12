import React from 'react';

/**
 * Componente Input reutilizable.
 * Maneja labels y estilos de formulario consistentes.
 */
const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false, className = "" }) => {
  return (
    <div className={className}>
      {/* Mostrar etiqueta si existe */}
      {label && <label className="block text-sm font-semibold mb-1 text-[#161616]">{label}</label>}
      
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:border-[#bf522b] focus:outline-none transition"
      />
    </div>
  );
};

export default Input;