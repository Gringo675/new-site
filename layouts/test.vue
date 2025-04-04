<script setup>
//
</script>

<template>
  <div class="flex h-screen flex-col">
    <header class="w-full bg-red-500">
      <!-- <div class="w-full h-10 bg-blue-300">header</div> -->
      <TheHeader />
    </header>
    <main class="w-full grow max-md:overflow-auto">
      <slot />
    </main>
    <footer class="w-full">
      <LazyTheFooter />
    </footer>
  </div>
</template>
