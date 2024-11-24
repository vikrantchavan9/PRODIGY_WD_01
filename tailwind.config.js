/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",  // Include all EJS files in the views folder
    "./public/**/*.html", // Include any HTML files (if applicable)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

