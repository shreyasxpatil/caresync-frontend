/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-on-surface": "#edf2ec",
        "background": "#F8FAF9",
        "text-primary": "#1A2E25",
        "on-secondary-fixed": "#012017",
        "error-clinical": "#DC2626",
        "surface": "#FFFFFF",
        "primary-fixed": "#90f7c0",
        "on-secondary-container": "#4a695d",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#2e4d42",
        "surface-container-high": "#e4eae3",
        "primary-fixed-dim": "#74daa6",
        "surface-tint": "#006c46",
        "on-primary-fixed-variant": "#005234",
        "accent-amber": "#FCD34D",
        "secondary-fixed": "#c8eadb",
        "border-structural": "#E2E8F0",
        "on-surface-variant": "#3e4942",
        "secondary-fixed-dim": "#accebf",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#bdcabf",
        "on-primary-fixed": "#002112",
        "primary": "#006642",
        "on-surface": "#171d19",
        "inverse-surface": "#2c322e",
        "surface-variant": "#dfe4de",
        "tertiary-container": "#b45453",
        "tertiary": "#953c3c",
        "on-primary": "#ffffff",
        "surface-container": "#eaefe9",
        "surface-container-highest": "#dfe4de",
        "on-secondary": "#ffffff",
        "tertiary-fixed": "#ffdad8",
        "primary-container": "#008255",
        "surface-dim": "#d6dbd5",
        "on-error": "#ffffff",
        "error": "#ba1a1a",
        "on-tertiary-fixed": "#410006",
        "on-tertiary-container": "#fff6f5",
        "on-primary-container": "#e0ffea",
        "secondary": "#466559",
        "secondary-container": "#c5e7d8",
        "inverse-primary": "#74daa6",
        "on-tertiary-fixed-variant": "#7d2a2c",
        "on-error-container": "#93000a",
        "on-background": "#171d19",
        "surface-bright": "#f6fbf4",
        "error-container": "#ffdad6",
        "surface-container-low": "#f0f5ef",
        "outline": "#6e7a71",
        "tertiary-fixed-dim": "#ffb3b0",
        
        // Legacy Support
        "text-main": "#1A2E25",
        "muted": "#6e7a71",
        "accent": "#FCD34D"
      },
      fontFamily: {
        "headline-md": ["Newsreader", "serif"],
        "body-base": ["Public Sans", "sans-serif"],
        "label": ["Public Sans", "sans-serif"],
        "display-xl": ["Newsreader", "serif"],
        "button": ["Public Sans", "sans-serif"],
        "headline-sm": ["Newsreader", "serif"],
        "display-lg": ["Newsreader", "serif"],
        "body-sm": ["Public Sans", "sans-serif"],
        
        // Legacy Support
        "heading": ["Newsreader", "serif"],
        "body": ["Public Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "sm": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      boxShadow: {
        "clinical": "0 4px 12px rgba(26, 46, 37, 0.08)"
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      }
    }
  },
  plugins: [],
}
