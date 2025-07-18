<script setup>
//
useTitle('ФГИС ГРСИ: Описания типов и методики поверки')

const url = `/api/getGrsi`
</script>

<template>
  <HelperDataFetch
    :url="url"
    v-slot="{ data: rstr }"
  >
    <article class="mx-4 my-8">
      <header class="mb-8">
        <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">ФГИС ГРСИ: Описания типов и методики поверки</h1>
      </header>
      <HelperDocsBlock :docs="{ rstr }" />
    </article>
  </HelperDataFetch>
</template>
