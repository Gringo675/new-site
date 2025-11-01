<script setup>
// компонент для получения статического контента из базы. В настоящее время не используется. Возможно, в будущем...
//todo: title

const route = useRoute()
const url = `/api/getData/content/${String(route.name)}`
</script>

<template>
  <HelperDataFetch
    :url="url"
    v-slot="{ data }">
    <article v-html="data"></article>
  </HelperDataFetch>
</template>
