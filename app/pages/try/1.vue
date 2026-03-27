<script setup>
//
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="h-screen">
    <header class="bg-orange-200 p-2">Header</header>
    <main class="bg-gray-200 pb-10">
      <div class="content flex flex-col bg-green-200">
        <div class="ffilter p-2">Filter</div>
        <div class="tableWrapper max-w-screen grow overflow-x-auto bg-red-400">
          <div class="table h-20 w-500">Table</div>
        </div>
      </div>
      <div class="tabs fixed bottom-0 left-1/2 w-full max-w-screen -translate-x-1/2 bg-gray-600 text-white">Tabs</div>
    </main>
  </div>
</template>

<!-- <template>
  <div class="flex h-screen flex-col">
    <header class="flex items-center justify-between bg-orange-200 p-2">Header</header>
    <main class="mx-auto w-full max-w-screen grow bg-gray-200 p-2 pb-12">
      <div class="wrapper flex h-full flex-col">
        <div class="content h-500 w-500">Content</div>
      </div>
    </main>
    <div class="tabs fixed bottom-0 left-1/2 w-full max-w-screen -translate-x-1/2 bg-blue-300 p-2">Tabs</div>
  </div>
</template> -->
<style>
body {
  overflow-y: auto; /* default */
}
</style>
