import { LazyAdminPrpsEditor } from '#components'

export function useProperties() {
  //
  const prps = shallowRef({})

  const updatePrps = async () => {
    prps.value = await myFetch('/api/admin/getProperties')
  }

  const editPrps = async (pGroup, pGroupName, activeIds, options = {}) => {
    //
    options.multiple = options.multiple ?? false

    if (!Array.isArray(activeIds)) {
      if (typeof activeIds === 'string') {
        activeIds = activeIds.split(',').map(id => {
          const n = Number(id)
          return isNaN(n) ? id : n
        })
      } else {
        activeIds = activeIds != null && typeof activeIds !== 'object' ? [activeIds] : []
      }
    }

    const overlay = useOverlay()
    const editor = overlay.create(LazyAdminPrpsEditor, {
      props: { pGroup: prps.value[pGroup], pGroupName, activeIds, options },
    })
    const edited = await editor.open()

    if (edited?.hasChanges) await updatePrps()

    return edited?.activeIds
  }

  onMounted(updatePrps)

  return {
    prps,
    editPrps,
  }
}
