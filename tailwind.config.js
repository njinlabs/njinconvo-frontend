/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#ebd8d8",
          200: "#d7b1b1",
          300: "#c28989",
          400: "#ae6262",
          500: "#9a3b3b",
          600: "#7b2f2f",
          700: "#5c2323",
          800: "#3e1818",
          900: "#1f0c0c",
        },
      },
      fontFamily: {
        montserrat: ["'Montserrat'", "sans-serif"],
        "nunito-sans": ["'Nunito Sans'", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
