import { LazyAdminPrpsEditor } from '#components'

export function useProperties() {
  //
  const prps = shallowRef({})

  const updatePrps = async () => {
    prps.value = await myFetch('/api/admin/getProperties')
  }

  onMounted(updatePrps)

  const editPrps = async (pGroup, pGroupName, activeIds, options = {}) => {
    //
    options.multiple = options.multiple ?? false
    activeIds = Array.isArray(activeIds) ? activeIds : activeIds.split(',')

    const overlay = useOverlay()
    const editor = overlay.create(LazyAdminPrpsEditor, {
      props: { pGroup: prps.value[pGroup], pGroupName, activeIds, options },
    })
    const response = await editor.open()
    console.log(`response: ${JSON.stringify(response, null, 2)}`)
  }

  return {
    prps,
    editPrps,
  }
}
