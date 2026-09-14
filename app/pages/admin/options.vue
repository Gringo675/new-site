<script setup>
//
useTitle('Опции | AdminPanel')
await checkAdminOnly()

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
  if (res.status === 'ok') showNotice({ title: `Search index activated! Docs in index: ${res.count}.`, type: 'success' })
  else if (res.status === 'error') {
    console.error(`Search index activation error: ${JSON.stringify(res.message, null, 2)}`)
    showNotice({ title: `Search index activation error!`, description: 'More info in console.', type: 'error' })
  }
}

const refreshSearchIndex = async () => {
  const res = await myFetch('/api/admin/system/refreshSearchIndex')
  if (res.status === 'ok') showNotice({ title: `Search index refreshed! Docs in index: ${res.count}.`, type: 'success' })
  else if (res.status === 'error') {
    console.error(`Search index refresh error: ${JSON.stringify(res.message, null, 2)}`)
    showNotice({ title: `Search index refresh error!`, description: 'More info in console.', type: 'error' })
  }
}

const runImageOptimization = async () => {
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
  showNotice({ title: `Test completed`, description: 'Check console for details.', type: 'info' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b border-gray-200 pb-4">
      <div>
        <h1 class="font-accent text-3xl font-bold">Опции системы</h1>
        <p class="text-sm text-gray-500 mt-1">Управление кэшем, поисковым индексом и оптимизацией изображений</p>
      </div>
      <UButton
        icon="i-lucide-arrow-left"
        label="Назад"
        variant="outline"
        to="/admin" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Clear Cache -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
            <UIcon name="i-lucide-trash-2" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Очистка кэша</h2>
          <p class="text-sm text-gray-500 mt-1">Очистить системный кэш приложения.</p>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-trash-2"
            label="Очистить кэш"
            color="neutral"
            variant="outline"
            class="w-full justify-center"
            @click="clearCache" />
        </div>
      </div>

      <!-- Activate Search Index -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <UIcon name="i-lucide-search-check" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Активация индекса</h2>
          <p class="text-sm text-gray-500 mt-1">Активировать поисковый индекс по документации и товарам.</p>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-search-check"
            label="Активировать"
            color="primary"
            variant="outline"
            class="w-full justify-center"
            @click="activateSearchIndex" />
        </div>
      </div>

      <!-- Refresh Search Index -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <UIcon name="i-lucide-refresh-cw" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Обновление индекса</h2>
          <p class="text-sm text-gray-500 mt-1">Перестроить и обновить поисковый индекс.</p>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-refresh-cw"
            label="Обновить индекс"
            color="primary"
            variant="outline"
            class="w-full justify-center"
            @click="refreshSearchIndex" />
        </div>
      </div>

      <!-- Run Image Optimization -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
            <UIcon name="i-lucide-image" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Оптимизация картинок</h2>
          <p class="text-sm text-gray-500 mt-1">Запустить оптимизацию изображений товаров.</p>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-image"
            label="Оптимизировать"
            color="primary"
            variant="outline"
            class="w-full justify-center"
            @click="runImageOptimization" />
        </div>
      </div>

      <!-- Test -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
            <UIcon name="i-lucide-flask-conical" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Тест системы</h2>
          <p class="text-sm text-gray-500 mt-1">Запустить отладочный системный тест.</p>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-flask-conical"
            label="Запустить тест"
            color="neutral"
            variant="outline"
            class="w-full justify-center"
            @click="onTest" />
        </div>
      </div>
    </div>
  </div>
</template>

