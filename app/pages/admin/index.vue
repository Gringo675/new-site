<script setup>
//
</script>

<template>
  <HelperAdminOnly>
    <div class="flex space-x-4">
      <UButton
        label="Менеджер категорий"
        to="/admin/categories" />
      <UButton
        label="Менеджер товаров"
        to="/admin/products" />
      <UButton
        label="Options"
        to="/admin/options" />
      <UButton
        label="Console"
        to="/admin/console" />
      <UButton
        label="Импорт данных"
        to="/admin/dbImport" />
      <UButton
        label="Products Prices"
        to="/admin/prices" />
      <UButton
        label="Log"
        to="/admin/log" />
    </div>
  </HelperAdminOnly>
</template>
