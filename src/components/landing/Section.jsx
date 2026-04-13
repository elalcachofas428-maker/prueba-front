import React, { useEffect, useRef } from 'react';

const Section = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Use a div wrapper instead of overriding section elements which already have an ID internally.
  return <div ref={ref} style={{ opacity: 0 }}>{children}</div>;
};

export default Section;
