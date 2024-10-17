/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5d3d48",
          100: "#d9d4ff",
          200: "#C9AAB4",
        },
        secondary: {
          DEFAULT: "#3D5D52",
          100: "#CEF6E7",
          200: "#90D3BC",
        },
      },
    },
  },
  plugins: [],
}

