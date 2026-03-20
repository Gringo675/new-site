<script setup>
//
</script>

<template>
  <HelperAdminOnly>
    <div class="flex gap-6">
      <UButton
        label="Контент менеджер"
        to="/admin/cms" />
      <UButton
        label="Options"
        to="/admin/options" />
      <UButton
        label="Console"
        to="/admin/console" />
      <UButton
        label="Log"
        to="/admin/log" />
    </div>
  </HelperAdminOnly>
</template>
