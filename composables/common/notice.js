let timer

export const useNotice = () => useState('notice', () => {
    return {
        isActive: false,
        type: '', // info, error, success
        text: '',
    }
})

export const showNotice = (text, type = 'info') => {
    if (process.server) return
    const notice = useNotice().value
    notice.text = text
    notice.type = type
    clearTimeout(timer)
    notice.isActive = true
    timer = setTimeout(() => notice.isActive = false, 4000)

}