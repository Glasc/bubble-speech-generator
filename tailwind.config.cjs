/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      "catppuccin-mocha": {
        primary: "#89b4fa", // blue
        secondary: "#f5c2e7", // pink
        accent: "#94e2d5", // teal
        neutral: "#11111b", // crust
        "base-100": "#1e1e2e", // base
        info: "#74c7ec", // sapphire
        success: "#a6e3a1", // green
        warning: "#f9e2af", // yellow
        error: "#f38ba8", // red
      },
    }],
  },
};
