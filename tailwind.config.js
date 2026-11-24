/** @type {import('tailwindcss').Config} */
export default {
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
        surface: '#FFFFFF',
        canvas: '#F7F9F8',
        ink: '#111827',
        line: '#E2E8E5',
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
