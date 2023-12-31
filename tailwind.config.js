/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        layout: `1fr 13.625rem min(35rem) 1fr`,
      },
      gridTemplateRows: {
        layout: "auto min-content",
      },
    },
  },
  plugins: [],
};
