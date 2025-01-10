<script setup></script>

<template>
  <div class="">
    <div class="p-2 bg-primary-100">
      <h1>Header</h1>
    </div>
    <div class="flex items-center p-2 bg-secondary-300">
      <ClientOnly>
        <CatsMenu />
        <TheSearch />
        <TheCart />
        <TheUser class="ml-auto" />
      </ClientOnly>
    </div>
  </div>
</template>
