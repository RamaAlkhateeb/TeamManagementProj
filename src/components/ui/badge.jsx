import React from 'react';

export const Badge = ({ children, variant = 'default' }) => {
  const baseStyle = 'px-2 py-1 text-xs rounded-full font-semibold';
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-300 text-gray-700',
  };
  return <span className={`${baseStyle} ${variants[variant]}`}>{children}</span>;
};