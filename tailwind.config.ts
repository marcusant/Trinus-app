import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans:  ["Inter", "sans-serif"],
      },
      fontSize: {
        "fluid-hero":  "clamp(4.5rem, 12vw, 9rem)",
        "fluid-h2":    "clamp(1.8rem, 4vw, 2.8rem)",
        "fluid-quote": "clamp(1.4rem, 3.5vw, 2.1rem)",
        "fluid-cta":   "clamp(2rem, 5vw, 3.2rem)",
      },
      keyframes: {
        scrollPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%":      { opacity: "1"   },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "scroll-pulse": "scrollPulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
