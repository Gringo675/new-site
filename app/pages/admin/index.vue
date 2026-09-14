<script setup>
//
useTitle('Админ-панель | AdminPanel')
await checkAdminOnly()

const checkVPS = async () => {
  const res = await $fetch('/api/admin/checkVPS')
  console.log(`checkVPS res: ${JSON.stringify(res, null, 2)}`)
  showNotice({ title: 'VPS Status checked', description: 'Check console for details.', type: 'info' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b border-gray-200 pb-4">
      <div>
        <h1 class="font-accent text-3xl font-bold">Админ-панель</h1>
        <p class="text-sm text-gray-500 mt-1">Управление сайтом, каталогом, системными настройками и логами</p>
      </div>
      <UButton
        icon="i-lucide-server"
        label="Check VPS"
        variant="outline"
        @click="checkVPS" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        to="/admin/cms"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-100 transition-colors">
            <UIcon name="i-lucide-folder-kanban" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Контент-менеджер</h2>
          <p class="text-sm text-gray-500 mt-1">Категории, товары, лейблы, цены и документация</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-primary-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/options"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
            <UIcon name="i-lucide-settings" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Опции</h2>
          <p class="text-sm text-gray-500 mt-1">Очистка кэша, индексы поиска и оптимизация картинок</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-blue-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/console"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-100 transition-colors">
            <UIcon name="i-lucide-terminal" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Консоль</h2>
          <p class="text-sm text-gray-500 mt-1">Интерактивный лог-монитор и выполнение команд в реальном времени</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-amber-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/log"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-100 transition-colors">
            <UIcon name="i-lucide-file-text" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Логи</h2>
          <p class="text-sm text-gray-500 mt-1">Просмотр системных ошибок, запросов и событий</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-purple-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
