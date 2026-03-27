export function useProperties() {
  const prps = shallowRef({})

  const updatePrps = async () => {
    prps.value = await myFetch('/api/admin/getProperties')
  }

  onMounted(updatePrps)

  async function handleChanges(groupName, newItems) {
    const oldItems = props.value[groupName]
    // ... logic here
    if (changedItems.length) {
      const success = await $fetch('/api/admin/setProperties', {
        method: 'POST',
        body: changedItems,
      })
      if (success) await getItems()
      else return false
    }
    return true
  }

  return {
    prps,
  }
}
