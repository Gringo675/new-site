// const message = reactive({
//   isActive: false,
// })

// const messageData = {
//   title: '',
//   body: '',
//   type: '', // info, error, success
//   callback: null,
// }

// export const useMessage = () => {
//   return message
// }

// export const useMessageData = () => {
//   return messageData
// }

// export const showMessage = (title, body, type = 'info', callback = null) => {
//   if (process.server) return
//   if (message.isActive) return
//   messageData.title = title
//   messageData.body = body
//   messageData.type = type
//   messageData.callback = callback
//   message.isActive = true
// }

// export const closeMessage = () => {
//   if (process.server) return
//   messageData.title = ''
//   messageData.body = ''
//   messageData.type = ''
//   messageData.callback = null
//   message.isActive = false
// }
