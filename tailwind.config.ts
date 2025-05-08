import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          muted: "hsl(var(--primary-muted))",
          50: "hsl(220, 100%, 95%)",
          100: "hsl(220, 100%, 90%)",
          200: "hsl(220, 95%, 85%)",
          300: "hsl(220, 90%, 75%)",
          400: "hsl(220, 90%, 65%)",
          500: "hsl(var(--primary))",
          600: "hsl(220, 90%, 45%)",
          700: "hsl(220, 90%, 35%)",
          800: "hsl(220, 90%, 25%)",
          900: "hsl(220, 90%, 15%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          muted: "hsl(var(--secondary-muted))",
          50: "hsl(340, 100%, 97%)",
          100: "hsl(340, 100%, 94%)",
          200: "hsl(340, 95%, 90%)",
          300: "hsl(340, 90%, 80%)",
          400: "hsl(340, 85%, 70%)",
          500: "hsl(var(--secondary))",
          600: "hsl(340, 85%, 45%)",
          700: "hsl(340, 85%, 35%)",
          800: "hsl(340, 85%, 25%)",
          900: "hsl(340, 85%, 15%)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          muted: "hsl(var(--accent-muted))",
          50: "hsl(262, 100%, 97%)",
          100: "hsl(262, 100%, 94%)",
          200: "hsl(262, 95%, 90%)",
          300: "hsl(262, 90%, 80%)",
          400: "hsl(262, 85%, 70%)",
          500: "hsl(var(--accent))",
          600: "hsl(262, 83%, 48%)",
          700: "hsl(262, 83%, 38%)",
          800: "hsl(262, 83%, 28%)",
          900: "hsl(262, 83%, 18%)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "shine": "shine 2s linear infinite",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 12px -4px rgba(0, 0, 0, 0.05)',
        'hover': '0 6px 24px -6px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;