/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        foreground: '#f4f4f4',
        primary: '#1db954',
        card: '#1a1a1a',
        accent: '#ffffff',
      },
    },
  },
  plugins: [],
}
