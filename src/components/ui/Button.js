import React from 'react';

const Button = ({ children, onClick, variant = "primary", disabled = false, type = "button", className = "" }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-block text-center";
  
  const variants = {
    primary: "bg-[#bf522b] text-white hover:bg-[#a3441f] hover:-translate-y-1 shadow-md",
    dark: "bg-[#161616] text-white hover:bg-[#2d2d2d] hover:-translate-y-1 shadow-md",
    secondary: "bg-white text-[#161616] border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-100 text-red-600 hover:bg-red-200"
  };

  return ( 
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`} // Aquí integramos el className
    >
      {children}
    </button>
  );
};

export default Button;