import React from 'react';
import logoLeadBook from '../assets/logo-leadbook.png';

const Logo = ({ size = 'default' }) => {
  const sizes = {
    footer: '28px',
    small: '32px',
    default: '40px',
    large: '40px',
    xlarge: '48px'
  };

  const finalHeight = sizes[size] || sizes.default;

  return (
    <img 
      src={logoLeadBook} 
      alt="LeadBook" 
      style={{ 
        height: finalHeight, 
        objectFit: 'contain' 
      }} 
    />
  );
};

export default Logo;
