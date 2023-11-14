module.exports = {
  content: [],
  theme: {
    extend: {
      // screens: {
      //   '-2xl': { max: '1535px' },
      //   '-xl': { max: '1279px' },
      //   '-lg': { max: '1023px' },
      //   '-md': { max: '767px' },
      //   '-sm': { max: '639px' },
      //   '@md': { min: '640px', max: '767px' },
      //   '@lg': { min: '768px', max: '1023px' },
      //   '@xl': { min: '1024px', max: '1279px' },
      //   '@2xl': { min: '1280px', max: '1535px' },
      // },
      screens: {
        '-xl': { max: '1535px' },
        '-lg': { max: '1279px' },
        '-md': { max: '1023px' },
        '-sm': { max: '767px' },
        '-xs': { max: '639px' },
        '@sm': { min: '640px', max: '767px' },
        '@md': { min: '768px', max: '1023px' },
        '@lg': { min: '1024px', max: '1279px' },
        '@xl': { min: '1280px', max: '1535px' },
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}
