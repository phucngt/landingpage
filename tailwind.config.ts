import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plex)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#2a2a2a',
          500: '#525252',
          400: '#737373',
          300: '#a3a3a3',
          200: '#d4d4d4',
          100: '#e5e5e5',
          50:  '#f5f5f4',
          25:  '#fafaf9',
        },
        accent: '#1f6f43',
      },
      letterSpacing: {
        tightish: '-0.015em',
        tighter2: '-0.03em',
      },
    },
  },
  plugins: [],
};

export default config;
