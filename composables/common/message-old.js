// const message = reactive({
//   active: false,
//   title: '',
//   description: '',
//   type: 'info', // info, error, success
//   callback: null,
//   preventClose: false, // if close the message on click outside
// })

// export const useMessage = () => {
//   return message
// }

// export const showMessage = (options = {}) => {
//   if (process.server) return
//   if (message.active) return

//   message.title = options.title ?? ''
//   message.description = options.description ?? ''
//   message.type = options.type ?? 'info' // info, error, success
//   message.callback = options.callback ?? null
//   message.preventClose = (typeof options.callback === 'function' || options.preventClose) ?? false
//   message.active = true
// }
