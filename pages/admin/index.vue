<script setup>
await myFetch('/api/user/isAdmin') // если не админ, выкинет ошибку
</script>

<template>
  <div class="flex space-x-4">
    <UButton
      label="Менеджер категорий"
      to="/admin/categories"
    />
    <UButton
      label="Менеджер товаров"
      to="/admin/products"
    />
    <UButton
      label="Options"
      to="/admin/options"
    />
    <UButton
      label="Console"
      to="/admin/console"
    />
  </div>
</template>
