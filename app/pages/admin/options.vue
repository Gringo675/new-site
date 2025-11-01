<script setup>
//
const siteStatus = ref(await myFetch('/api/admin/system/siteStatus', { method: 'post', payload: {} }))
const changeSiteStatus = async () => {
  const newStatus = siteStatus.value === '0' ? '1' : '0'
  siteStatus.value = await myFetch('/api/admin/system/siteStatus', {
    method: 'post',
    payload: {
      setStatus: newStatus,
    },
  })
}

const clearCache = async () => {
  const res = await myFetch('/api/admin/system/clearCache')
  if (res.status === 'ok') showNotice({ title: `Кэш очищен!`, type: 'success' })
  else if (res.status === 'error') {
    console.error(`Cache import error: ${JSON.stringify(res.message, null, 2)}`)
    showNotice({ title: `Cache import error!`, description: 'More info in console.', type: 'error' })
  }
}
</script>

<template>
  <HelperAdminOnly>
    <div class="flex gap-4">
      <UButton
        label="Очистить кэш"
        @click="clearCache" />
      <UButton
        :label="Number(siteStatus) ? 'Открыть сайт' : 'Закрыть сайт'"
        @click="changeSiteStatus" />
    </div>
  </HelperAdminOnly>
</template>
