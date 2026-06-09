/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // CineBook cinema theme — light surfaces + tomato accent.
        // `ink` reads dark→light by number to match Tailwind conventions:
        //   950 = app background, 900 = card/surface, 800 = hover,
        //   700 = subtle border, 600 = control border.
        ink: {
          950: "#f4f6f8",
          900: "#ffffff",
          800: "#eef1f5",
          700: "#e4e7ec",
          600: "#d0d5dd"
        },
        tomato: {
          400: "#ff6f59",
          500: "#ff4d4d",
          600: "#e63946"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
