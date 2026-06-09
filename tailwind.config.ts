import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f3f7ef",
          100: "#e3edda",
          300: "#9fbd93",
          500: "#55764d",
          700: "#2f513b",
          900: "#183324"
        },
        cream: "#f7f0e3",
        linen: "#fbf8f1",
        moss: "#cbd9bd",
        clay: "#d6bf99",
        stone: "#8b9088",
        ink: "#17241c"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(35, 52, 37, 0.12)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.7)"
      },
      fontFamily: {
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
