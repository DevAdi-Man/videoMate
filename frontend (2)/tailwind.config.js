/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-in": "slide-in 0.5s ease-out ",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      colors: {
        text: "#f1eaee",
        background: "#0e060a",
        primary: "#e092bc",
        secondary: "#95175a",
        accent: "#f50c89",
        gray: {
          200: "#e5e7eb",
          400: "#9ca3af",
          600: "#4b5563",
        },
        red: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
        blue: {
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
        },
        green: {
          200: "#bbf7d0",
        },
        white: "#ffffff",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      display: "Oswald, ui-serif", // Adds a new `font-display` class
    },
  },
  plugins: [],
};
