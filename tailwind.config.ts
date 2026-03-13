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
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          soft: "#EEF2FF",
        },
        surface: "#FFFFFF",
        background: "#F9FAFB",
        border: "#E5E7EB",
        success: "#059669",
        danger: "#DC2626",
        ink: {
          DEFAULT: "#111827",
          muted: "#6B7280",
        },
        darkbg: "#0F172A",
        darksurface: "#1E293B",
        darkink: "#F1F5F9",
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 23, 42, 0.08)",
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
