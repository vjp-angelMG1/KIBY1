import React from 'react';

const Card = ({ children, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;