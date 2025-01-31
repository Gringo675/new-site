<script setup></script>

<template>
  <header class="sticky z-[21]">
    <TheHeader />
  </header>
  <main class="w-full flex-grow -md:overflow-auto">
    <slot />
  </main>
  <footer>
    <LazyTheFooter />
  </footer>
</template>
