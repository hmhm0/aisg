import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070c",
          900: "#0b1020",
          800: "#111a33"
        },
        accent: {
          400: "#7dd3fc",
          500: "#38bdf8",
          600: "#0ea5e9"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(125, 211, 252, 0.14), 0 24px 80px rgba(15, 23, 42, 0.55)"
      },
      backgroundImage: {
        "radial-soft":
          "radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 42%), radial-gradient(circle at 20% 20%, rgba(125, 211, 252, 0.10), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
