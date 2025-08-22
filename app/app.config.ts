export default defineAppConfig({
  ui: {
    colors: {
      primary: 'violet',
      secondary: 'orange',
      tertiary: 'indigo',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'cursor-pointer disabled:cursor-default disabled:opacity-50 aria-disabled:cursor-default aria-disabled:opacity-50',
      },
    },
    // Nuxt UI v2:
    // primary: 'violet',
    // gray: 'slate',
    // modal: { wrapper: 'z-30' },
    // button: {
    //   base: 'disabled:cursor-default disabled:opacity-50 aria-disabled:cursor-default aria-disabled:opacity-50',
    // },
  },
})
