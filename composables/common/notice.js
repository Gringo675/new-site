let timer

const notice = reactive({
  isActive: false,
})

const noticeData = {
  type: '', // info, error, success
  text: '',
}

export const useNotice = () => {
  return notice
}

export const useNoticeData = () => {
  return noticeData
}

export const showNotice = (text, type = 'info') => {
  if (process.server) return
  noticeData.text = text
  noticeData.type = type
  clearTimeout(timer)
  notice.isActive = true
  timer = setTimeout(() => (notice.isActive = false), 4000)
}
