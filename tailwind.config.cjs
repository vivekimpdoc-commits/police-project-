/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#002147',
        'primary-light': '#0d386b',
        'primary-dark': '#001229',
        accent: '#FF9933',
        'accent-hover': '#e68a2e',
      }
    },
  },
  plugins: [],
}
