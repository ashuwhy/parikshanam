/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#58CC02',
          secondary: '#84fb42',
          dark: '#2a6900',
        },
        ui: {
          bg: '#f8f6f6',
          card: '#FFFFFF',
          border: '#dddddc',
          accent: '#a3d8ff',
        },
        status: {
          success: '#58CC02',
          warning: '#FFC800',
          error: '#FF4B4B',
          locked: '#afafaf',
        },
      },
      fontFamily: {
        sans: ['System'],
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
