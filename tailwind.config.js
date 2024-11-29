/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-primary': '#2D5A27',  // Deep forest green
        'agri-secondary': '#4A7B3F', // Lighter green
        'agri-accent': '#8BC34A',    // Fresh leaf green
      }
    },
  },
  daisyui: {
    themes: [
      {
        farmtheme: {
          "primary": "#2D5A27",
          "secondary": "#4A7B3F",
          "accent": "#8BC34A",
          "neutral": "#1E293B",
          "base-100": "#F3F4F6",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      "light", 
      "dark", 
      "cupcake",
      "lemonade"
    ],
    darkTheme: "dark",
  },
  plugins: [require("daisyui")],
}
