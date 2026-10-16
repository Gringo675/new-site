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
        <p class="mt-1 text-sm text-gray-500">Управление каталогом, категориями, товарами, ценами и документацией</p>
      </div>
      <UButton
        icon="i-lucide-arrow-left"
        label="В админ-панель"
        variant="outline"
        to="/admin" />
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        to="/admin/cms/aiCatDescription"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
            <UIcon
              name="i-lucide-sparkles"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">AI описание категорий</h2>
          <p class="mt-1 text-sm text-gray-500">Генерация и редактирование описаний категорий с помощью AI</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-purple-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/aiCatCharacteristics"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
            <UIcon
              name="i-lucide-cpu"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">AI характеристики категорий</h2>
          <p class="mt-1 text-sm text-gray-500">Управление и автогенерация характеристик товаров по категориям</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/aiProductCharacteristics"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
            <UIcon
              name="i-lucide-boxes"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-teal-600">AI характеристики товаров</h2>
          <p class="mt-1 text-sm text-gray-500">Пакетная генерация и ревизия характеристик товаров по ГОСТ/ГРСИ</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-teal-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/categories"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
            <UIcon
              name="i-lucide-folder-tree"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">Категории</h2>
          <p class="mt-1 text-sm text-gray-500">Иерархия категорий каталога и редактирование свойств</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/products"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
            <UIcon
              name="i-lucide-package"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">Товары</h2>
          <p class="mt-1 text-sm text-gray-500">Управление товарами, характеристиками, изображениями и статусами</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/labels"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
            <UIcon
              name="i-lucide-tag"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-amber-600">Лейблы</h2>
          <p class="mt-1 text-sm text-gray-500">Метки и бейджи продуктов (хиты, скидки, новинки и др.)</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-amber-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/vendors"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-cyan-100">
            <UIcon
              name="i-lucide-truck"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-cyan-600">Артикулы поставщиков</h2>
          <p class="mt-1 text-sm text-gray-500">Связывание товаров с артикулами и EAN поставщиков (ЧИЗ, Кибер и др.)</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-cyan-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/documentation"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100">
            <UIcon
              name="i-lucide-book-open"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-rose-600">Документация</h2>
          <p class="mt-1 text-sm text-gray-500">ГОСТы, ТУ, паспорта и реестры средств измерений</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-rose-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/prices"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-50 text-lime-600 transition-colors group-hover:bg-lime-100">
            <UIcon
              name="i-lucide-badge-percent"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-lime-600">Цены товаров</h2>
          <p class="mt-1 text-sm text-gray-500">Управление ценовой политикой и прайс-листами</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-lime-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/cms/dbImport"
        class="group hover:border-primary-500 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
            <UIcon
              name="i-lucide-database"
              class="h-6 w-6" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-teal-600">Импорт данных</h2>
          <p class="mt-1 text-sm text-gray-500">Импорт каталогов, брендов, товаров и пользователей из внешних баз</p>
        </div>
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-teal-600">
          <span>Открыть</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
