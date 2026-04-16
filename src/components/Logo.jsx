import React from 'react';
import logoLeadBook from '../assets/logo-leadbook.png';

const Logo = ({ size = 'default' }) => {
  const sizes = {
    footer: '28px',
    small: '32px',
    default: '40px',
    large: '40px',
    xlarge: '48px',
    huge: '65px',
    jumbo: '90px'
  };

  const finalHeight = sizes[size] || sizes.default;

  return (
    <video 
      src="/navbar-logo.mp4?v=2" 
      autoPlay
      loop
      muted
      playsInline
      style={{ 
        height: finalHeight, 
        objectFit: 'contain',
        borderRadius: '6px'
      }} 
    />
  );
};

export default Logo;
