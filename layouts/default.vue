<script setup></script>

<template>
  <div class="flex flex-col h-screen">
    <header>
      <TheHeader />
    </header>
    <main class="w-full flex-grow -sm:overflow-auto">
      <slot />
    </main>
    <footer>
      <LazyTheFooter />
    </footer>
  </div>
</template>
