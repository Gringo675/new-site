<script setup>

</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <TheMessage/>
      <TheLoader/>
      <TheNotice/>
    </ClientOnly>
  </div>
</template>
