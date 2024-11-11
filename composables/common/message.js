/**
 * Теперь showMessage отдает промис! Для диалогового варианта ожидаем значения: Отмена - false, Ок - true.
 */

const message = reactive({
  active: false,
  title: '',
  description: '',
  type: 'info', // info, error, success
  resolve: null,
  preventClose: false, // if close the message on click outside
})

export const useMessage = () => {
  return message
}

export const showMessage = (options = {}) => {
  if (process.server) return
  if (message.active) return

  options.isDialog = options.isDialog ?? false

  return new Promise(resolve => {
    message.title = options.title ?? ''
    message.description = options.description ?? ''
    message.type = options.type ?? 'info' // info, error, success
    message.resolve = options.isDialog ? resolve : null
    message.preventClose = (options.isDialog || options.preventClose) ?? false
    message.active = true

    !options.isDialog && resolve()
  })
}
