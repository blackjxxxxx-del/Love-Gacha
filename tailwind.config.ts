import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        thai: ["Sarabun", "sans-serif"],
      },
      colors: {
        gacha: {
          pink: "#FF6B9D",
          purple: "#C84BFF",
          gold: "#FFD700",
          darkgold: "#B8960C",
          bg: "#1a0533",
        },
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "40%": { transform: "rotate(8deg)" },
          "60%": { transform: "rotate(-6deg)" },
          "80%": { transform: "rotate(6deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        goldPulse: {
          "0%, 100%": { boxShadow: "0 0 20px #FFD700, 0 0 40px #FFD700" },
          "50%": { boxShadow: "0 0 40px #FFD700, 0 0 80px #FFD700, 0 0 120px #B8960C" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        goldPulse: "goldPulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
