/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(var(--accent))',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.08)',
        'map-panel': '0 2px 6px rgba(0,0,0,0.1)',
      },
      fontFamily: {
        maven: ['Maven Pro', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwind-scrollbar')],
};
