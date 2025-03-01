module.exports = {
  content: [],
  theme: {
    extend: {
      screens: {
        '-xl': { max: '1279px' },
        '-lg': { max: '1023px' },
        '-md': { max: '767px' },
        '-sm': { max: '639px' },
        '-xs': { max: '479px' },
        xs: { min: '480px' },
        // '-xl': { max: '1535px' },
        // '-lg': { max: '1279px' },
        // '-md': { max: '1023px' },
        // '-sm': { max: '767px' },
        // '-xs': { max: '639px' },
        // '@sm': { min: '640px', max: '767px' },
        // '@md': { min: '768px', max: '1023px' },
        // '@lg': { min: '1024px', max: '1279px' },
        // '@xl': { min: '1280px', max: '1535px' },
        nrw: { raw: '(max-height: 640px)' }, // narrow, for image viewer
      },
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        // can't name primary because it's NuxtUI reserved word (binded to primary in app.config.ts)
        'my-primary': {
          50: '#fffdea',
          100: '#fff6c5',
          200: '#ffee85',
          300: '#ffdf46',
          400: '#ffcd1b',
          500: '#ffab00',
          600: '#e28200',
          700: '#bb5a02',
          800: '#984508',
          900: '#7c390b',
          950: '#481c00',
        },
        secondary: {
          50: '#fffdea',
          100: '#fff6c5',
          200: '#ffee85',
          300: '#ffdf46',
          400: '#ffcd1b',
          500: '#ffab00',
          600: '#e28200',
          700: '#bb5a02',
          800: '#984508',
          900: '#7c390b',
          950: '#481c00',
        },
        tertiary: {
          50: '#fffdea',
          100: '#fff6c5',
          200: '#ffee85',
          300: '#ffdf46',
          400: '#ffcd1b',
          500: '#ffab00',
          600: '#e28200',
          700: '#bb5a02',
          800: '#984508',
          900: '#7c390b',
          950: '#481c00',
        },
        accent: {
          50: '#fffdea',
          100: '#fff6c5',
          200: '#ffee85',
          300: '#ffdf46',
          400: '#ffcd1b',
          500: '#ffab00',
          600: '#e28200',
          700: '#bb5a02',
          800: '#984508',
          900: '#7c390b',
          950: '#481c00',
        },
      },
      // colors: {
      //   // can't name primary because it's NuxtUI reserved word (binded to primary in app.config.ts)
      //   'my-primary': {
      //     50: '#eef7ff',
      //     100: '#d8ecff',
      //     200: '#badeff',
      //     300: '#8bcbff',
      //     400: '#55adff',
      //     500: '#2d8aff',
      //     600: '#176af9',
      //     700: '#0f53e6',
      //     800: '#123eab',
      //     900: '#163d92',
      //     950: '#132758',
      //   },
      //   secondary: {
      //     50: '#f2f2ff',
      //     100: '#e9e7ff',
      //     200: '#d4d2ff',
      //     300: '#b6aeff',
      //     400: '#9280ff',
      //     500: '#6e4dff',
      //     600: '#5c29fe',
      //     700: '#4e17ea',
      //     800: '#4113c4',
      //     900: '#3c13af',
      //     950: '#1f086d',
      //   },
      //   tertiary: {
      //     50: '#effefc',
      //     100: '#c7fff9',
      //     200: '#90fff3',
      //     300: '#51f7ec',
      //     400: '#1de4dd',
      //     500: '#04c8c3',
      //     600: '#009999',
      //     700: '#057f80',
      //     800: '#0a6365',
      //     900: '#0d5354',
      //     950: '#002f33',
      //   },
      //   accent: {
      //     50: '#fffdea',
      //     100: '#fff6c5',
      //     200: '#ffee85',
      //     300: '#ffdf46',
      //     400: '#ffcd1b',
      //     500: '#ffab00',
      //     600: '#e28200',
      //     700: '#bb5a02',
      //     800: '#984508',
      //     900: '#7c390b',
      //     950: '#481c00',
      //   },
      // },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
}
