/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FBFAFF',
        primary: {
          DEFAULT: '#6D28D9',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED'
        },
        accent: {
          DEFAULT: '#EC4899',
          light: '#F472B6',
          dark: '#DB2777'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        'card': '16px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(109, 40, 217, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 30px -5px rgba(109, 40, 217, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px rgba(109, 40, 217, 0.15)',
        'glow-accent': '0 0 25px rgba(236, 72, 153, 0.2)',
      }
    },
  },
  plugins: [],
}
