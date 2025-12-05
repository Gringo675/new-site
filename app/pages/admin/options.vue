<script setup>
//

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
    </div>
  </HelperAdminOnly>
</template>
