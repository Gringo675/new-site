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
    table: {
      variants: {
        pinned: {
          true: {
            th: 'bg-inherit',
            td: 'bg-inherit after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-gray-300 after:content-[""]',
          },
        },
      },
    },
  },
})
