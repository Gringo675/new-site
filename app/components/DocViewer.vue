<script setup>
//
const props = defineProps({
  title: String,
  url: String,
})

const src = props.url + '#toolbar=0'
</script>

<template>
  <UModal
    :title="title"
    fullscreen
    :ui="{
      overlay: 'bg-transparent',
      content: 'bg-gray-900/90 divide-none',
      wrapper: 'max-w-full',
      title: 'text-gray-300 text-2xl truncate pr-8',
      body: 'p-0 sm:p-0',
    }"
    :close="{
      color: 'warning',
      variant: 'link',
      icon: 'i-lucide-x',
      class: 'z-10 p-0 focus-visible:ring-0 focus-visible:outline-none',
      ui: {
        leadingIcon: 'size-8 sm:size-10',
      },
    }">
    <template #description></template>
    <template #body>
      <iframe
        class="h-full w-full"
        :src="src"
        frameborder="0"
        scrolling="no"
        type="application/pdf"
        >Похоже, Вы используете устаревший браузер.</iframe
      >
    </template>
  </UModal>
</template>
