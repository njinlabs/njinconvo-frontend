/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#cddaee",
          200: "#9bb5dd",
          300: "#6991cb",
          400: "#376cba",
          500: "#0547a9",
          600: "#043987",
          700: "#032b65",
          800: "#021c44",
          900: "#010e22",
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
