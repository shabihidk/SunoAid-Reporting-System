/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#6366f1',
        accent: '#f8fafc',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Noto Sans', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

