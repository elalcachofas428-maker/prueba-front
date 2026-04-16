import React, { useState, useEffect } from 'react';

/**
 * RotationWrapper
 * Forces a 90-degree rotation on mobile portrait to simulate landscape.
 */
export default function RotationWrapper({ children }) {
  const [shouldRotate, setShouldRotate] = useState(false);

  useEffect(() => {
    const checkRotation = () => {
      const isMobile = window.innerWidth < 1024;
      const isPortrait = window.innerHeight > window.innerWidth;
      const devicePreference = localStorage.getItem('leadbook_device');

      // Only rotate if manually selected 'mobile' AND it's a mobile screen in portrait
      setShouldRotate(isMobile && isPortrait && devicePreference === 'mobile');
    };

    // Run on mount
    checkRotation();

    // Re-check on resize/orientation change
    window.addEventListener('resize', checkRotation);
    window.addEventListener('orientationchange', checkRotation);
    
    // Custom event or simple interval to catch localStorage changes without reload
    const interval = setInterval(checkRotation, 500);

    return () => {
      window.removeEventListener('resize', checkRotation);
      window.removeEventListener('orientationchange', checkRotation);
      clearInterval(interval);
    };
  }, []);

  if (!shouldRotate) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '100vw',
      width: '100vh',
      height: '100vw',
      transform: 'rotate(90deg)',
      transformOrigin: 'top left',
      overflow: 'auto',
      background: '#000',
      zIndex: 99999,
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}>
        {children}
      </div>
    </div>
  );
}
