// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#ffc107',
        secondary: '#212121',
        error: '#d32f2f',
        background: {
          default: '#ffffff',
          paper: '#f5f5f5',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
