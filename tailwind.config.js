/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f3e8ff',
          100: '#e9d5ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6'
        }
      }
    }
  },
  plugins: []
}
