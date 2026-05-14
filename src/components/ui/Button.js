import React from 'react';

const Button = ({ children, onClick, variant = "primary", disabled = false, type = "button", className = "" }) => {
  // Estilos base: Esquinas cortadas (clip-path) y transiciones premium
  const baseStyles = "relative px-6 py-2.5 font-bold text-sm tracking-wide transition-all duration-300 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 inline-flex items-center justify-center gap-2";
  
  // Clip-path para el corte diagonal innovador
  const shapeStyles = "clip-path-[polygon(8px_0,_100%_0,_calc(100%-8px)_100%,_0_100%)]";

  const variants = {
    // Botón Principal: Naranja con resplandor al hover
    primary: `bg-[#bf522b] text-white hover:bg-[#a3441f] hover:shadow-[0_0_20px_rgba(191,82,43,0.4)] hover:-translate-y-0.5 ${shapeStyles}`,
    
    // Botón Secundario: Estilo Ghost (transparente) con borde que aparece
    secondary: `bg-transparent text-[#161616] border border-gray-300 hover:border-[#bf522b] hover:text-[#bf522b] hover:bg-[#bf522b]/5 ${shapeStyles}`,
    
    // Botón Oscuro (Admin/Destacado)
    dark: `bg-[#161616] text-white hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 ${shapeStyles}`,
    
    // Botón de Peligro: Rojo suave
    danger: `bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] ${shapeStyles}`,
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;