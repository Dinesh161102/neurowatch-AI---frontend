/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(0, 217, 255, 0.2)",
        background: "hsl(222, 47%, 5%)",
        foreground: "hsl(210, 40%, 98%)",
        card: {
          DEFAULT: "hsl(222, 47%, 8%)",
          foreground: "hsl(210, 40%, 98%)"
        },
        primary: {
          DEFAULT: "hsl(187, 100% 50%)",
          foreground: "hsl(222, 47%, 5%)"
        },
        secondary: {
          DEFAULT: "hsl(276, 63%, 58%)",
          foreground: "hsl(210, 40%, 98%)"
        },
        muted: {
          DEFAULT: "hsl(215, 28%, 17%)",
          foreground: "hsl(215, 20%, 65%)"
        },
        accent: {
          DEFAULT: "hsl(187, 100%, 50%)",
          foreground: "hsl(222, 47%, 5%)"
        },
        destructive: {
          DEFAULT: "hsl(338, 100%, 51%)",
          foreground: "hsl(210, 40%, 98%)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    },
  },
  plugins: [],
}
