import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          soft: "rgba(37, 99, 235, 0.12)",
        },
        surface: "#ffffff",
        background: "#f7f7f7",
        border: "#e0e0e0",
        success: "#4BE6B1",
        danger: "#FF6B6B",
        ink: {
          DEFAULT: "#0f172a",
          muted: "#6b7280",
        },
        // Dark-mode fallbacks used with `dark:` utilities
        darkbg: "#080D1E",
        darksurface: "#151B34",
        darkink: "#F6F1FF",
        accent: {
          purple: "#7C5CFF",
          violet: "#B66DFF",
          pink: "#FF6B8A",
          cyan: "#67E8F9",
        },
        toolBlue: "#169DCF",
        toolRed: "#DF232A",
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.16)",
        glow: "0 0 0 1px rgba(148, 163, 184, 0.32), 0 18px 40px rgba(15, 23, 42, 0.24)",
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
        spinSlow: "spin 1s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
