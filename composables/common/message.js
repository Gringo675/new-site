export const useMessage = () => useState('message', () => {
    return {
        isActive: false,
        title: '',
        body: '',
        type: '', // info, error, success
        callback: null,
        isDialog: false,
    }
})

export const showMessage = (title, body, type = 'info', callback = null) => {
    if (process.server) return
    const message = useMessage().value
    if (message.isActive) return
    message.title = title
    message.body = body
    message.type = type
    if (typeof callback === 'function') {
        message.callback = callback
        message.isDialog = true
    }
    message.isActive = true
}