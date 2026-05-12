/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eeedfe',
          100: '#cecbf6',
          200: '#afa9ec',
          400: '#7c6ff7',
          500: '#6059e8',
          600: '#534ab7',
          800: '#3c3489',
          900: '#26215c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Syne', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
