export const showNotice = async (options = {}) => {
  if (import.meta.server) return

  options.title = options.title ?? ''
  options.description = options.description ?? ''
  options.type = options.type ?? 'info' // info, error, success

  const toast = useToast()
  toast.add({
    title: options.title,
    description: options.description,
    icon: {
      info: 'i-heroicons-information-circle',
      error: 'i-heroicons-exclamation-circle',
      success: 'i-heroicons-check-circle',
    }[options.type],
    color: options.type === 'info' ? 'primary' : options.type,
  })
}
