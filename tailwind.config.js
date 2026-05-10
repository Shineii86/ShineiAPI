/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Tailwind Config — Neo-Brutalist × Apple Polish     ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        surface: {
          DEFAULT: 'var(--bg)',
          dim: 'var(--bg-dim)',
          bright: 'var(--bg-bright)',
        },
        green: {
          DEFAULT: 'rgb(var(--green) / <alpha-value>)',
          400: '#4ade80',
          500: 'rgb(var(--green) / <alpha-value>)',
          700: '#15803d',
        },
        yellow: {
          DEFAULT: 'rgb(var(--yellow) / <alpha-value>)',
          300: '#fde047',
          400: '#facc15',
          500: 'rgb(var(--yellow) / <alpha-value>)',
        },
        red: {
          DEFAULT: 'rgb(var(--red) / <alpha-value>)',
          300: '#fca5a5',
          400: '#f87171',
          500: 'rgb(var(--red) / <alpha-value>)',
        },
        blue: {
          DEFAULT: 'rgb(var(--blue) / <alpha-value>)',
          500: 'rgb(var(--blue) / <alpha-value>)',
        },
      },
      maxWidth: {
        'container': 'var(--container)',
        'containerWidth': '1152px',
      },
      fontFamily: {
        display: ['var(--font-display)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      boxShadow: {
        'brutal': '0 2px 8px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'brutal-lg': '0 4px 12px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)',
        'brutal-sm': '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
        'brutal-accent': '0 4px 16px rgba(255,204,0,0.2)',
        'brutal-red': '0 4px 16px rgba(230,59,46,0.15)',
        'brutal-blue': '0 4px 16px rgba(0,85,255,0.15)',
      },
      borderRadius: {
        'brutal': '12px',
        'brutal-lg': '16px',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'reveal-up 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-in-left': 'reveal-left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
