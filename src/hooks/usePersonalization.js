import { useState, useEffect } from 'react';

const defaultThemes = {
  bgMain: '#05070A',
  bgPanel: '#0F1720',
  accent: '#00E5FF',
  fontSans: "'Outfit', sans-serif",
  fontSerif: "'Playfair Display', serif"
};

export const usePersonalization = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('subzeroTheme');
    return saved ? JSON.parse(saved) : defaultThemes;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-main', theme.bgMain);
    root.style.setProperty('--bg-panel', theme.bgPanel);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--font-sans', theme.fontSans);
    root.style.setProperty('--font-serif', theme.fontSerif);
    localStorage.setItem('subzeroTheme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (newValues) => {
    setTheme(prev => ({ ...prev, ...newValues }));
  };

  const resetTheme = () => {
    setTheme(defaultThemes);
  };

  return { theme, updateTheme, resetTheme };
};
