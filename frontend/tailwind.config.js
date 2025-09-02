/** @type {import('tailwindcss').Config} */
export default {
  // --- Content ---
  // Configure the paths to all of your HTML templates,
  // JavaScript components, and any other source files
  // that contain Tailwind class names.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Extend the default Tailwind theme.
  theme: {
    extend: {},
  },
  
// Adding Tailwind plugins.
  plugins: [],
};
