import { LazyTheFeedback } from '#components'

const feedback = useOverlay().create(LazyTheFeedback)

export const showFeedback = (options = {}) => {
  if (import.meta.server) return

  options.title = options.title ?? 'Обратная связь'
  options.description =
    options.description ??
    'Воспользуйтесь данной формой, чтобы прислать Ваши вопросы, предложения, или отправить заявку.'
  options.message = options.message ?? ''

  feedback.open(options)
}

export const closeFeedback = () => feedback.close()
