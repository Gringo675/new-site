<script setup>
useTitle('Сортировка каталога (sort_key) | AdminPanel')
await checkAdminOnly()

const stats = ref(null)
const sample = ref([])
const loading = ref(false)
const selectedCatId = ref(null)
const specificIds = ref('')
const rootCats = ref([])

// Загрузка статистики и примеров ключей
const loadStats = async () => {
  try {
    const res = await myFetch('/api/admin/system/recalculateSortKeys')
    if (res?.status === 'ok') {
      stats.value = res.stats
      sample.value = res.sample || []
    }
  } catch (err) {
    console.error('Ошибка загрузки статистики:', err)
    showNotice({ title: 'Ошибка загрузки статистики', description: err.message, type: 'error' })
  }
}

// Загрузка списка корневых категорий
const loadCategories = async () => {
  try {
    const { data: catsData } = await useCats()
    if (Array.isArray(catsData.value)) {
      rootCats.value = catsData.value.map(cat => ({
        value: cat.id,
        label: `${cat.name} (id: ${cat.id})`,
      }))
      if (rootCats.value.length > 0 && !selectedCatId.value) {
        selectedCatId.value = rootCats.value[0].value
      }
    }
  } catch (err) {
    console.error('Ошибка загрузки категорий:', err)
  }
}

// Обработчик пересчета
const handleRecalculate = async (target, confirmMessage) => {
  const proceed = await showMessage({
    title: 'Подтвердите действие',
    description: confirmMessage || 'Запустить пересчет sort_key для товаров?',
    type: 'info',
    isDialog: true,
  })
  if (!proceed) return

  loading.value = true
  try {
    const res = await myFetch('/api/admin/system/recalculateSortKeys', {
      method: 'POST',
      payload: { target },
    })

    if (res?.status === 'ok') {
      showNotice({
        title: 'Успешно обновлено!',
        description: `Пересчитано товаров: ${res.updatedCount}`,
        type: 'success',
      })
      await loadStats()
    } else {
      showNotice({ title: 'Ошибка пересчета', type: 'error' })
    }
  } catch (err) {
    console.error('Ошибка пересчета sort_key:', err)
    showNotice({ title: 'Ошибка пересчета sort_key', description: err.message, type: 'error' })
  } finally {
    loading.value = false
  }
}

// Пересчет всех товаров
const recalculateAll = () => {
  handleRecalculate(undefined, 'Пересчитать sort_key для ВСЕХ товаров каталога? Операция обновит все товары в БД согласно актуальным весам характеристик.')
}

// Пересчет выбранной категории
const recalculateCategory = () => {
  const rawId = selectedCatId.value
  const catId = typeof rawId === 'object' && rawId !== null ? rawId.value : rawId
  if (!catId) return
  const cat = rootCats.value.find(c => c.value === Number(catId))
  handleRecalculate({ categoryId: Number(catId) }, `Пересчитать товары категории "${cat?.label || catId}"?`)
}

// Пересчет указанных ID
const recalculateSpecific = () => {
  const ids = specificIds.value
    .split(/[,\s]+/)
    .map(Number)
    .filter(n => n > 0)

  if (!ids.length) {
    showNotice({ title: 'Укажите хотя бы один ID товара', type: 'error' })
    return
  }

  handleRecalculate(ids, `Пересчитать sort_key для указанных ID (${ids.join(', ')})?`)
}

onMounted(async () => {
  await Promise.all([loadStats(), loadCategories()])
})
</script>

<template>
  <div class="space-y-6 p-2">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 pb-4">
      <div>
        <h1 class="font-accent text-3xl font-bold text-gray-900">Синхронизация сортировки каталога</h1>
        <p class="mt-1 text-sm text-gray-500">Управление составными лексикографическими ключами (sort_key) для детерминированного порядка ГОСТ</p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-refresh-cw"
          label="Обновить статус"
          variant="outline"
          :loading="loading"
          @click="loadStats" />
        <UButton
          icon="i-lucide-arrow-left"
          label="В CMS"
          variant="outline"
          to="/admin/cms" />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Всего товаров</span>
          <UIcon
            name="i-lucide-package"
            class="h-5 w-5 text-gray-400" />
        </div>
        <div class="mt-2 text-2xl font-bold text-gray-900">
          {{ stats?.totalProducts ?? '—' }}
        </div>
        <p class="mt-1 text-xs text-gray-400">Опубликовано: {{ stats?.publishedProducts ?? '—' }}</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-emerald-600">С валидным sort_key</span>
          <UIcon
            name="i-lucide-check-circle-2"
            class="h-5 w-5 text-emerald-500" />
        </div>
        <div class="mt-2 text-2xl font-bold text-emerald-600">
          {{ stats?.validKeysCount ?? '—' }}
        </div>
        <p class="mt-1 text-xs text-gray-400">51 символ (9 свойств + ID)</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <span
            class="text-sm font-medium"
            :class="stats?.emptyKeysCount > 0 ? 'text-rose-600' : 'text-gray-500'">
            Без ключа (пустые)
          </span>
          <UIcon
            name="i-lucide-alert-circle"
            class="h-5 w-5"
            :class="stats?.emptyKeysCount > 0 ? 'text-rose-500' : 'text-gray-400'" />
        </div>
        <div
          class="mt-2 text-2xl font-bold"
          :class="stats?.emptyKeysCount > 0 ? 'text-rose-600' : 'text-gray-700'">
          {{ stats?.emptyKeysCount ?? '—' }}
        </div>
        <p class="mt-1 text-xs text-gray-400">Требуют расчета ключа</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <span
            class="text-sm font-medium"
            :class="stats?.invalidCount > 0 ? 'text-amber-600' : 'text-gray-500'">
            Некорректная длина
          </span>
          <UIcon
            name="i-lucide-alert-triangle"
            class="h-5 w-5"
            :class="stats?.invalidCount > 0 ? 'text-amber-500' : 'text-gray-400'" />
        </div>
        <div
          class="mt-2 text-2xl font-bold"
          :class="stats?.invalidCount > 0 ? 'text-amber-600' : 'text-gray-700'">
          {{ stats?.invalidCount ?? '—' }}
        </div>
        <p class="mt-1 text-xs text-gray-400">Длина отличается от 51 знака</p>
      </div>
    </div>

    <!-- Actions Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- 1. Полный пересчет -->
      <div class="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <UIcon
              name="i-lucide-rotate-cw"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Полный пересчет базы</h2>
          <p class="mt-2 text-sm text-gray-500">Пересчитывает ключи для всех товаров каталога. Используется после изменения весов в usePrpsGroupsMap, массовых импортов или прямого редактирования БД.</p>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-play"
            label="Пересчитать все товары"
            color="primary"
            class="w-full justify-center"
            :loading="loading"
            @click="recalculateAll" />
        </div>
      </div>

      <!-- 2. Пересчет по категории -->
      <div class="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UIcon
              name="i-lucide-folder-tree"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Пересчет категории</h2>
          <p class="mt-2 text-sm text-gray-500">Быстрое обновление ключей только для товаров выбранной корневой категории.</p>
          <div class="mt-4">
            <label class="mb-1 block text-xs font-medium text-gray-600">Категория:</label>
            <USelect
              v-model="selectedCatId"
              :items="rootCats"
              value-key="value"
              placeholder="Выберите категорию..."
              class="w-full" />
          </div>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-folder-sync"
            label="Пересчитать категорию"
            color="neutral"
            variant="solid"
            class="w-full justify-center"
            :disabled="!selectedCatId"
            :loading="loading"
            @click="recalculateCategory" />
        </div>
      </div>

      <!-- 3. Точечный пересчет по ID -->
      <div class="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UIcon
              name="i-lucide-hash"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Точечный пересчет ID</h2>
          <p class="mt-2 text-sm text-gray-500">Обновление отдельных товаров по их ID (можно ввести несколько через запятую или пробел).</p>
          <div class="mt-4">
            <label class="mb-1 block text-xs font-medium text-gray-600">ID товаров:</label>
            <input
              v-model="specificIds"
              type="text"
              placeholder="110001, 110002..."
              class="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:ring-1 focus:outline-none" />
          </div>
        </div>
        <div class="mt-6">
          <UButton
            icon="i-lucide-sparkles"
            label="Пересчитать указанные ID"
            color="neutral"
            variant="outline"
            class="w-full justify-center"
            :disabled="!specificIds.trim()"
            :loading="loading"
            @click="recalculateSpecific" />
        </div>
      </div>
    </div>

    <!-- Sample Table -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Примеры сформированных ключей</h2>
          <p class="text-sm text-gray-500">Первые 5 товаров из базы данных для проверки структуры и длины (51 символ)</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">ID</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Категория</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">sort_key</th>
              <th class="px-4 py-2 text-center font-semibold text-gray-600">Символов</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr
              v-for="item in sample"
              :key="item.id"
              class="hover:bg-gray-50">
              <td class="px-4 py-2.5 font-medium whitespace-nowrap text-gray-900">{{ item.id }}</td>
              <td class="px-4 py-2.5 whitespace-nowrap text-gray-600">{{ item.category_name || item.category_id }}</td>
              <td class="px-4 py-2.5 font-mono text-xs font-semibold whitespace-nowrap text-indigo-700">{{ item.sort_key || '—' }}</td>
              <td class="px-4 py-2.5 text-center whitespace-nowrap">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="item.sort_key?.length === 51 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'">
                  {{ item.sort_key?.length ?? 0 }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 text-sm text-blue-900">
      <div class="flex items-start gap-3">
        <UIcon
          name="i-lucide-info"
          class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div class="space-y-1">
          <div class="font-semibold text-blue-950">Как устроен ключ sort_key:</div>
          <p class="text-blue-800">
            Ключ состоит строго из 10 блоков (9 характеристик + 1 блок ID товара):
            <code class="rounded bg-blue-100 px-1 py-0.5 font-mono text-xs text-blue-900">[B1]_[B2]_[B3]_[B4]_[B5]_[B6]_[B7]_[B8]_[B9]_[ID]</code>
            . Длина всегда ровно 51 символ.
          </p>
          <p class="text-blue-800">
            Порядок блоков определяется динамически для категории через
            <code class="font-mono text-xs">usePrpsGroupsMap(category_id)</code>
            по приоритету
            <code class="font-mono text-xs">(sortOrdering ?? ordering)</code>
            . Отключенные группы и пустые характеристики получают значение
            <code class="font-mono text-xs">'9999'</code>
            и уходят в конец группы.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
