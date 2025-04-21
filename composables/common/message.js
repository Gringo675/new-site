/**
 * showMessage отдает промис. Для диалогового варианта ожидаем значения: Отмена - false, Ок - true.
 */
import { LazyTheMessage } from '#components'

const message = useOverlay().create(LazyTheMessage)

export const showMessage = (options = {}) => {
  if (import.meta.server) return

  options.title = options.title ?? ''
  options.description = options.description ?? ''
  options.type = options.type ?? 'info' // info, error, success
  options.isDialog = options.isDialog ?? false

  message.open(options)
}
