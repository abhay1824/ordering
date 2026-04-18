/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgb(15 23 42 / 0.06), 0 12px 24px -6px rgb(15 23 42 / 0.12)",
        "card-hover":
          "0 8px 12px -2px rgb(15 23 42 / 0.08), 0 20px 40px -12px rgb(234 88 12 / 0.18)",
      },
    },
  },
  plugins: [],
}

