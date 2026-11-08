/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          navy: '#050814',
          darkBlue: '#070C1E',
          cardDark: '#0A1026',
          cardLight: '#FFFFFF',
          glass: 'rgba(10, 16, 38, 0.82)',
          glassLight: 'rgba(255, 255, 255, 0.92)',
          electric: '#2563EB',
          neon: '#38BDF8',
          cyan: '#06B6D4',
          blueAccent: '#1D4ED8',
          deepBlue: '#0F172A',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.3)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.5)',
        'glow-electric': '0 0 30px -5px rgba(37, 99, 235, 0.6)',
        'glow-neon': '0 0 30px -5px rgba(56, 189, 248, 0.55)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'neu-dark': '8px 8px 16px #030610, -8px -8px 16px #090e24',
      },
      animation: {
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'float-reverse': 'floatReverse 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(4deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
