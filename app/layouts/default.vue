<script setup></script>

<template>
  <header class="sticky z-21">
    <TheHeader />
  </header>
  <main class="mx-auto w-full max-w-7xl grow bg-gray-50 p-2 md:p-4 2xl:my-3 2xl:rounded-xl">
    <slot />
    <ClientOnly>
      <RecentlyViewed />
    </ClientOnly>
  </main>
  <footer>
    <TheFooter />
  </footer>
</template>
