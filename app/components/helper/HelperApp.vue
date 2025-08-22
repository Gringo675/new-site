<script setup>
// For app.vue and error.vue
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col">
      <NuxtLayout>
        <slot />
      </NuxtLayout>
    </div>
  </UApp>
</template>
