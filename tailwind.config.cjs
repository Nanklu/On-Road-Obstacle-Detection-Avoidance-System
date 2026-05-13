/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7'
        },
        accent: {
          500: '#22c55e',
          600: '#16a34a'
        }
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(56, 189, 248, 0.25)',
        'glow-accent': '0 0 40px rgba(34, 197, 94, 0.25)'
      }
    }
  },
  plugins: []
};

