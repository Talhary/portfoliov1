import { withUt } from "uploadthing/tw";
import { themeColors } from "./lib/colors";

export default withUt({
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
       
        "2xl": "1400px",
      },
    },
    extend: {
      screens:{
         'xs':'500px',
        'mid':'1220px',
      },
      colors:{
        'big-card': themeColors.bigCard,
        'card-bg': themeColors.cardBg,
        'card-light-bg': themeColors.cardLightBg,
        'primary': themeColors.primary,
        'primary-hover': themeColors.primaryHover,
        "card-bg-1": themeColors.cardBg1,
        "card-bg-2": themeColors.cardBg2,
        "card-bg-3": themeColors.cardBg3,
        'slider-bg': themeColors.sliderBg,
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
});

