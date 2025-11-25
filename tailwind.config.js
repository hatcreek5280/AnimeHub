/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Zen Dots', 'cursive'],
      },
      colors: {
        background: '#020617', // slate-950
        surface: '#1e293b', // slate-800
        primary: '#8b5cf6', // violet-500
        secondary: '#ec4899', // pink-500
        accent: '#06b6d4', // cyan-500
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
