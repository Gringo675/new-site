const feedback = reactive({
  isActive: false,
})

const feedbackData = {
  title: '',
  text: '',
}

export const useFeedback = () => {
  return feedback
}

export const useFeedbackData = () => {
  return feedbackData
}

export const showFeedback = (title = 'Обратная связь', text = '') => {
  if (process.server) return
  if (feedback.isActive) return
  feedbackData.title = title
  feedbackData.text = text
  feedback.isActive = true
}

export const closeFeedback = () => {
  if (process.server) return
  feedbackData.title = ''
  feedbackData.body = ''
  feedback.isActive = false
}
