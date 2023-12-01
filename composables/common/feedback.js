const feedback = reactive({
  isActive: false,
  title: '',
  description: '',
})

export const useFeedback = () => {
  return feedback
}

export const showFeedback = (options = {}) => {
  if (process.server) return
  if (feedback.isActive) return

  feedback.title = options.title ?? 'Обратная связь'
  feedback.description = options.description ?? ''
  feedback.isActive = true
}

// export const closeFeedback = () => {
//   if (process.server) return
//   feedbackData.title = ''
//   feedbackData.body = ''
//   feedback.isActive = false
// }
