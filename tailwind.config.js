module.exports = {
  content: ['./src/**/*.{js,jsx}', './pages/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0B0B0B',
          gray: '#141414',
          yellow: '#F1C40F',
          yellowDark: '#D6AE04'
        }
      },
      container: { center: true, padding: '1rem' },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,.15)'
      }
    }
  },
  plugins: []
}
