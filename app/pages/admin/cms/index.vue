<script setup>
//
useTitle('Контент менеджер | AdminPanel')
await checkAdminOnly()
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b border-gray-200 pb-4">
      <div>
        <h1 class="font-accent text-3xl font-bold">Контент-менеджер</h1>
        <p class="text-sm text-gray-500 mt-1">Управление каталогом, категориями, товарами, ценами и документацией</p>
      </div>
      <UButton
        icon="i-lucide-arrow-left"
        label="В админ-панель"
        variant="outline"
        to="/admin" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        to="/admin/cms/aiCatDescription"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-100 transition-colors">
            <UIcon name="i-lucide-sparkles" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">AI описание категорий</h2>
          <p class="text-sm text-gray-500 mt-1">Генерация и редактирование описаний категорий с помощью AI</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-purple-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/aiCatCharacteristics"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
            <UIcon name="i-lucide-cpu" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">AI характеристики категорий</h2>
          <p class="text-sm text-gray-500 mt-1">Управление и автогенерация характеристик товаров по категориям</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-indigo-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/categories"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
            <UIcon name="i-lucide-folder-tree" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Категории</h2>
          <p class="text-sm text-gray-500 mt-1">Иерархия категорий каталога и редактирование свойств</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-blue-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/products"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
            <UIcon name="i-lucide-package" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Товары</h2>
          <p class="text-sm text-gray-500 mt-1">Управление товарами, характеристиками, изображениями и статусами</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-emerald-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/labels"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-100 transition-colors">
            <UIcon name="i-lucide-tag" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Лейблы</h2>
          <p class="text-sm text-gray-500 mt-1">Метки и бейджи продуктов (хиты, скидки, новинки и др.)</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-amber-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/vendors"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4 group-hover:bg-cyan-100 transition-colors">
            <UIcon name="i-lucide-truck" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">Артикулы поставщиков</h2>
          <p class="text-sm text-gray-500 mt-1">Связывание товаров с артикулами и EAN поставщиков (ЧИЗ, Кибер и др.)</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-cyan-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/documentation"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4 group-hover:bg-rose-100 transition-colors">
            <UIcon name="i-lucide-book-open" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">Документация</h2>
          <p class="text-sm text-gray-500 mt-1">ГОСТы, ТУ, паспорта и реестры средств измерений</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-rose-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/prices"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-lime-50 flex items-center justify-center text-lime-600 mb-4 group-hover:bg-lime-100 transition-colors">
            <UIcon name="i-lucide-badge-percent" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-lime-600 transition-colors">Цены товаров</h2>
          <p class="text-sm text-gray-500 mt-1">Управление ценовой политикой и прайс-листами</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-lime-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/dbImport"
        class="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-500 transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4 group-hover:bg-teal-100 transition-colors">
            <UIcon name="i-lucide-database" class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">Импорт данных</h2>
          <p class="text-sm text-gray-500 mt-1">Импорт каталогов, брендов, товаров и пользователей из внешних баз</p>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium text-teal-600 mt-4">
          <span>Открыть</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

