/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#176B5B',
          50: '#E8F2F0',
          100: '#C9E4DF',
          200: '#9BC9C0',
          300: '#6DAEA0',
          400: '#3F9381',
          500: '#176B5B',
          600: '#135A4D',
          700: '#0F483E',
          800: '#0B372F',
          900: '#07251F',
        },
        accent: {
          DEFAULT: '#1F2933',
          50: '#E8EAEC',
          100: '#C6CACF',
          200: '#A0A7AF',
          300: '#7A8390',
          400: '#4E5764',
          500: '#1F2933',
          600: '#1B232C',
          700: '#171D24',
          800: '#12171C',
          900: '#0C1013',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1A1F26',
        },
        canvas: {
          DEFAULT: '#F7F9F8',
          dark: '#11161B',
        },
        ink: {
          DEFAULT: '#111827',
          dark: '#E2E8E5',
        },
        line: {
          DEFAULT: '#E2E8E5',
          dark: '#2A323B',
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
