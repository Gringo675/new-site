<script setup>
//
await checkAdminOnly()
</script>

<template>
  <div class="flex gap-6">
    <UButton
      label="AI описание категорий"
      to="/admin/cms/aiCatDescription" />
    <UButton
      label="AI характеристики категорий"
      to="/admin/cms/aiCatCharacteristics" />
    <UButton
      label="Категории"
      to="/admin/cms/categories" />
    <UButton
      label="Товары"
      to="/admin/cms/products" />
    <UButton
      label="Лейблы"
      to="/admin/cms/labels" />
    <UButton
      label="Артикулы поставщиков"
      to="/admin/cms/vendors" />
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
</template>
