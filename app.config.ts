export default defineAppConfig({
  ui: {
    primary: 'violet',
    gray: 'slate',
    modal: { wrapper: 'z-30' },
    button: {
      base: 'disabled:cursor-default disabled:opacity-50 aria-disabled:cursor-default aria-disabled:opacity-50',
    },
  },
})
