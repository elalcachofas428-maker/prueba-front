/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        "inverse-on-surface": "#2c303b",
        "secondary-container": "#6001d1",
        "on-surface": "#dfe2f0",
        "on-secondary-container": "#c9aeff",
        "surface-container-high": "#0a0a0a",
        "primary": "#a8e8ff",
        "on-surface-variant": "#bbc9cf",
        "on-primary": "#003642",
        "surface-bright": "#353944",
        "surface-container-lowest": "#000",
        "surface-dim": "#020202",
        "surface-variant": "#31353f",
        "surface-tint": "#3cd7ff",
        "surface-container-low": "#050505",
        "on-primary-fixed-variant": "#004e5f",
        "primary-container": "#00d4ff",
        "surface-container": "#080808",
        "surface-container-highest": "#31353f",
        "on-background": "#dfe2f0",
        "outline": "#859398",
        "surface": "#020202",
        "outline-variant": "#3c494e"
      },
      fontFamily: {
        "headline": ["Syne", "sans-serif"],
        "label": ["Manrope", "sans-serif"]
      }
    },
  },
  plugins: [],
}
