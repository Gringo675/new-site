<script setup>

</script>

<template>
  <div>
    <TheHeader/>
    <NuxtPage/>
    <TheFooter/>
    <ClientOnly>
      <TheMessage/>
      <TheLoader/>
    </ClientOnly>
  </div>
</template>
