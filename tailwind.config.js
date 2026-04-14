/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'panda-black': '#1E293B',
        'soft-snow': '#F8FAFC',
        'digital-lavender': '#818CF8',
        'sakura-pink': '#FFD1DC',
        'mint-green': '#2DD4BF',
      },
      borderRadius: {
        'kawaii': '1.5rem',
      }
    },
  },
  plugins: [],
}