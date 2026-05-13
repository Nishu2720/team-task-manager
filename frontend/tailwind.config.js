/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Syne', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#020209',
          800: '#07070f',
          700: '#0d0d1a',
          600: '#12121f',
          500: '#1a1a2e',
          400: '#22223a',
          300: '#2d2d4a',
        },
      },
      backgroundImage: {
        'glow-purple': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'glow-blue':   'radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)',
        'glow-pink':   'radial-gradient(ellipse at center, rgba(236,72,153,0.12) 0%, transparent 70%)',
        'grad-primary': 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #db2777 100%)',
        'grad-purple':  'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        'grad-blue':    'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
        'grad-pink':    'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
        'grad-green':   'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)',
        'grad-amber':   'linear-gradient(135deg, #d97706 0%, #ef4444 100%)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        pulse2: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '0.8' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp: { 'from': { opacity: '0', transform: 'translateY(16px)' }, 'to': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { 'from': { opacity: '0', transform: 'scale(0.95)' }, 'to': { opacity: '1', transform: 'scale(1)' } },
        borderSpin: { 'to': { '--angle': '360deg' } },
      },
      animation: {
        'float':    'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse2':   'pulse2 3s ease-in-out infinite',
        'shimmer':  'shimmer 2s linear infinite',
        'fade-up':  'fadeUp .35s ease forwards',
        'scale-in': 'scaleIn .25s ease forwards',
      },
      boxShadow: {
        'glow-sm':  '0 0 20px rgba(139,92,246,0.2)',
        'glow-md':  '0 0 40px rgba(139,92,246,0.25)',
        'glow-lg':  '0 0 60px rgba(139,92,246,0.3)',
        'glow-blue':'0 0 30px rgba(59,130,246,0.25)',
        'glow-pink':'0 0 30px rgba(236,72,153,0.25)',
        'glass':    '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card':     '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
=======
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
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
      },
    },
  },
  plugins: [],
};
