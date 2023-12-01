export const showNotice = async (options = {}) => {
  if (process.server) return

  options.title = options.title ?? ''
  options.description = options.description ?? ''
  options.type = options.type ?? 'info' // info, error, success

  const toast = useToast()
  toast.add({
    title: options.title,
    description: options.description,
    icon:
      options.type === 'error'
        ? 'i-heroicons-exclamation-circle'
        : options.type === 'success'
        ? 'i-heroicons-check-circle'
        : 'i-heroicons-information-circle',
    color: options.type === 'error' ? 'red' : options.type === 'success' ? 'emerald' : 'secondary',
  })
}
