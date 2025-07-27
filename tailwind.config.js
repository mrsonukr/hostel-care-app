/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './App.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Okra-Regular'], // Default font
        okra: ['Okra-Regular'],
        bold: ['Okra-Bold'],
        light: ['Okra-Light'],
        medium: ['Okra-Medium'],
        semibold: ['Okra-SemiBold'],
        thin: ['Okra-Thin'],
      },
    },
  },
  plugins: [],
};