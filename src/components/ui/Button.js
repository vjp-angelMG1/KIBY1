import React from 'react';

const Button = ({ children, onClick, variant = "primary", disabled = false, type = "button" }) => {
  // Estilos base comunes
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Variantes de color
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-100 text-red-600 hover:bg-red-200"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;