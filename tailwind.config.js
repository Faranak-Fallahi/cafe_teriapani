/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F26A2E',
        secondary: '#FFD166',
        background: '#FFF4DF',
        dark: '#3D2924',
        sage: '#7A9B76',
      },
    },
  },
  plugins: [],
}
