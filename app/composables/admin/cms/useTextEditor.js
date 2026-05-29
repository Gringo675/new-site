import { LazyAdminTextEditor } from '#components'

export function useTextEditor() {
  const editText = async (currentValue, fieldName, title) => {
    const overlay = useOverlay()
    const editor = overlay.create(LazyAdminTextEditor, {
      props: { modelValue: currentValue, fieldName, title },
    })
    return await editor.open()
  }

  return {
    editText,
  }
}
