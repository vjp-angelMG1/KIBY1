import React from 'react';

const Card = ({ children, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick}
      // Quitado el overflow-hidden para que no corte el botón
      className={`bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}; 

export default Card;