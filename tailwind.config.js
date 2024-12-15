/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nyt': ["nyt", "ui-sans-serif"],
        'nyt-bold': ["nyt-bold", "ui-sans-serif"],
        'karnak': ["karnak-bold", "ui-serif"],
      }
    },
  },
  plugins: [],
}