export const useNotice = () => useState('notice', () => {
    return {
        isActive: false,
        type: '', // info, error, success
        text: '',
        timer: null,
    }
})
export const showNotice = (text, type = 'info') => {
    const notice = useNotice()
    notice.value.text = text
    notice.value.type = type
    clearTimeout( notice.value.timer)
    notice.value.isActive = true
    notice.value.timer = setTimeout(() => notice.value.isActive = false, 4000)
}