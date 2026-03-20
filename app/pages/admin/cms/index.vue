<script setup>
//
</script>

<template>
  <HelperAdminOnly>
    <div class="flex gap-6">
      <UButton
        label="Категории"
        to="/admin/cms/categories" />
      <UButton
        label="Товары"
        to="/admin/cms/products" />
      <UButton
        label="Документация"
        to="/admin/cms/documentation" />
      <UButton
        label="Цены товаров"
        to="/admin/cms/prices" />
      <UButton
        label="Импорт данных"
        to="/admin/cms/dbImport" />
    </div>
  </HelperAdminOnly>
</template>
