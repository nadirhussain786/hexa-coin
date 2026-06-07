import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cosmic: {
          bg: "#080514",        // deeper space black
          card: "#110D2A",      // rich dark indigo
          surface: "#1A1438",   // card surface
          surface2: "#221852",  // elevated surface
          accent: "#7C3AED",    // vivid violet
          highlight: "#A855F7", // bright purple
          secondary: "#F43F5E", // rose-red
          tertiary: "#06B6D4",  // sky cyan
          gold: "#F59E0B",      // amber-gold for rewards
          text: "#F1F5F9",      // soft white
          muted: "#94A3B8",     // slate muted
          border: "#2D1B69",    // subtle purple border
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-10px)" },
        },
        "float-rotate": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":       { transform: "translateY(-10px) rotate(15deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(124,58,237,0.35)" },
          "50%":       { boxShadow: "0 0 30px rgba(168,85,247,0.7), 0 0 60px rgba(168,85,247,0.2)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "hex-reveal": {
          "0%":   { transform: "scale(0.5) rotate(-30deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "count-up": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pop-in": {
          "0%":  { transform: "scale(0.5)", opacity: "0" },
          "80%": { transform: "scale(1.08)" },
          "100%":{ transform: "scale(1)", opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "ping-slow": {
          "0%,100%": { transform: "scale(1)",   opacity: "0.6" },
          "50%":     { transform: "scale(1.5)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        float:            "float 3.5s ease-in-out infinite",
        "float-rotate":   "float-rotate 5s ease-in-out infinite",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
        shimmer:          "shimmer 2s linear infinite",
        "hex-reveal":     "hex-reveal 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
        "count-up":       "count-up 0.3s ease-out",
        "slide-up":       "slide-up 0.3s ease-out",
        "fade-in":        "fade-in 0.2s ease-out",
        "pop-in":         "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        "spin-slow":      "spin-slow 8s linear infinite",
        "ping-slow":      "ping-slow 2.5s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
