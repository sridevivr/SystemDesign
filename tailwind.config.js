/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#58cc02',
          dark: '#2fa400',
        },
      },
    },
  },
  plugins: [],
};
