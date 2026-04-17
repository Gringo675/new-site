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

const activateSearchIndex = async () => {
  const res = await myFetch('/api/admin/system/activateSearchIndex')
  if (res.status === 'ok')
    showNotice({ title: `Search index activated! Docs in index: ${res.count}.`, type: 'success' })
  else if (res.status === 'error') {
    console.error(`Search index activation error: ${JSON.stringify(res.message, null, 2)}`)
    showNotice({ title: `Search index activation error!`, description: 'More info in console.', type: 'error' })
  }
}

const refreshSearchIndex = async () => {
  const res = await myFetch('/api/admin/system/refreshSearchIndex')
  if (res.status === 'ok')
    showNotice({ title: `Search index refreshed! Docs in index: ${res.count}.`, type: 'success' })
  else if (res.status === 'error') {
    console.error(`Search index refresh error: ${JSON.stringify(res.message, null, 2)}`)
    showNotice({ title: `Search index refresh error!`, description: 'More info in console.', type: 'error' })
  }
}

const runImageOptimization = async () => {
  // Возвращаем успешный JSON-ответ
  //   return { success: true, message: `Обработано ${filesToProcess.length} файлов.` }
  // } catch (error) {
  //   console.error('Ошибка при оптимизации изображений:', error)

  //   // Возвращаем JSON-ответ с ошибкой
  //   setResponseStatus(event, 500)
  //   return { success: false, message: 'Произошла ошибка на сервере.', error: error.message }
  // }
  const res = await myFetch('/api/imgOptimization/products')
  if (res.success) showNotice({ title: `Image optimization completed! `, description: res.message, type: 'success' })
  else if (res.status === 'error') {
    console.error(`Image optimization error: ${JSON.stringify(res.message, null, 2)}`)
    showNotice({ title: `Image optimization error!`, description: 'More info in console.', type: 'error' })
  }
}

const onTest = async () => {
  const result = await $fetch('/api/admin/system/test')
  console.log(`Test result: ${JSON.stringify(result, null, 2)}`)
}
</script>

<template>
  <HelperAdminOnly>
    <div class="flex gap-4">
      <UButton
        label="Clear Cache"
        @click="clearCache" />
      <UButton
        label="Activate Search Index"
        @click="activateSearchIndex" />
      <UButton
        label="Refresh Search Index"
        @click="refreshSearchIndex" />
      <UButton
        label="Run product image optimization"
        @click="runImageOptimization" />
      <UButton
        label="Test"
        @click="onTest" />
    </div>
  </HelperAdminOnly>
</template>
