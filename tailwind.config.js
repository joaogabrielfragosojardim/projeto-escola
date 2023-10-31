/** @type {import('tailwindcss').Config} */

export const content = ['./src/**/*.{js,ts,jsx,tsx}'];
export const theme = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '4rem',
  },
  colors: {
    main: '#5C6189',
    complement: {
      100: '#D9D9D9',
      200: '#4D4D4D',
    },
    wrong: '#AB2727',
  },
  extend: {
    fontFamily: {
      sans: ['var(--font-noto-sans)'],
      serif: ['var(--font-noto-serif)'],
    },
  },
};
export const plugins = [];
