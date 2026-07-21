import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        // Portfolio colors
        background: '#000000',
        card: '#1a1a1a',
        border: '#333333',
        accent: '#8b5cf6',
        accentHover: '#7c3aed',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
