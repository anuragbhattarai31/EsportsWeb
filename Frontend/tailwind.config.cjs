module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { // Ensure blue colors exist
        semored: "#C8102E",
        semoblack: "#000000",
      }
    },
  },
  plugins: [],
}