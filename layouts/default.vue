<script setup></script>

<template>
  <header class="sticky z-[21]">
    <TheHeader />
  </header>
  <main class="w-full max-w-screen-xl mx-auto flex-grow -md:overflow-auto bg-yellow-50 bg-opacity-95">
    <slot />
  </main>
  <footer>
    <LazyTheFooter />
  </footer>
</template>
