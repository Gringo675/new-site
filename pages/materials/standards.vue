<script setup>
//
useTitle('Нормативная документация - ГОСТы, ТУ')

const url = `/api/getStandards`
</script>

<template>
  <HelperDataFetch
    :url="url"
    v-slot="{ data: stnd }"
  >
    <article class="mx-4 my-8">
      <header class="mb-8">
        <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Нормативная документация - ГОСТы, ТУ</h1>
      </header>
      <HelperDocsBlock :docs="{ stnd }" />
    </article>
  </HelperDataFetch>
</template>
