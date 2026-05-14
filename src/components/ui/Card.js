import React from 'react';

const Card = ({ children, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-100/80 shadow-sm transition-all duration-500 ease-out hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 group shine-effect ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;