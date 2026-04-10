<script setup>
//
const checkVPS = async () => {
  const res = await $fetch('/api/admin/checkVPS')
console.log(`checkVPS res: ${JSON.stringify(res, null, 2)}`)
}
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
      <UButton
        label="check VPS"
        @click="checkVPS" />
    </div>
  </HelperAdminOnly>
</template>
