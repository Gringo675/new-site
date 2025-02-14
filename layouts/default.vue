<script setup></script>

<template>
  <header class="sticky z-[21]">
    <TheHeader />
  </header>
  <main class="w-full max-w-screen-xl mx-auto flex-grow bg-orange-50 2xl:my-3 2xl:rounded-xl -md:overflow-auto">
    <slot />
  </main>
  <footer>
    <LazyTheFooter />
  </footer>
</template>
