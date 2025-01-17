<script setup></script>

<template>
  <header class="sticky top-[-120px] z-[21]">
    <TheHeader />
  </header>
  <main class="w-full flex-grow -sm:overflow-auto">
    <slot />
  </main>
  <footer>
    <LazyTheFooter />
  </footer>
</template>
