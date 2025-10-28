/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./layouts/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0b0b0b",
          fg: "#ffffff",
          accent: "#f6c20a",
          muted: "#151515",
          line: "#1f1f1f",
        },
      },
      maxWidth: { container: "1180px" }
    },
  },
  plugins: [],
}
