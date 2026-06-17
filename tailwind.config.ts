import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0a6e8a",
          mid: "#0d9bb5",
          light: "#e8f8fb",
        },
        background: "#f7feff",
        emergency: "#e85d26",
        dark: "#1a2e35",
        success: "#16a34a",
        warning: "#d97706",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(10, 110, 138, 0.08)",
        "card-hover": "0 8px 40px rgba(10, 110, 138, 0.16)",
        glow: "0 0 24px rgba(13, 155, 181, 0.3)",
        "glow-emergency": "0 0 24px rgba(232, 93, 38, 0.35)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0a6e8a 0%, #0d9bb5 50%, #16b8d4 100%)",
        "card-gradient": "linear-gradient(145deg, #ffffff 0%, #e8f8fb 100%)",
        "dark-gradient": "linear-gradient(135deg, #1a2e35 0%, #0a6e8a 100%)",
        "emergency-gradient": "linear-gradient(135deg, #e85d26 0%, #f07040 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "bounce-slow": "bounce 3s infinite",
        "bounce-subtle": "bounceSubtle 2s infinite ease-in-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10%)" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
