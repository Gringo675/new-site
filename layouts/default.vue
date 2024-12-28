<script setup></script>

<template>
  <header class="sticky -top-10 z-[21]">
    <TheHeader />
  </header>
  <main class="min-h-96">
    <slot />
  </main>
  <footer>
    <LazyTheFooter />
  </footer>
  <!-- <div class="flex flex-col h-screen">
    <header class="sticky -top-10 z-[21]">
      <TheHeader />
    </header>
    <main class="w-full flex-grow -sm:overflow-auto">
      <slot />
    </main>
    <footer>
      <LazyTheFooter />
    </footer>
  </div> -->
</template>
