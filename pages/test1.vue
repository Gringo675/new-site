<script setup>
//
// definePageMeta({
//   layout: 'empty',
// })
const items = [
  // 'https://picsum.photos/seed/qqqaaa/200/300',
  // 'https://picsum.photos/seed/qqqaaa/600/200',
  // 'https://picsum.photos/seed/qqqaaa/300/300',
  // 'https://picsum.photos/seed/aaabbbaabbb/3000/2000',
  // 'https://picsum.photos/seed/aaabbbaabbb/200/600',
  // 'https://picsum.photos/seed/aaabbbaabbb/600/200',
]

const aaa = await $fetch('/api/apiTest')
</script>

<template>
  <div class="">aaa: {{ aaa }}</div>
  <!-- <div class="m-10 w-sm">
    <imageViewerInline
      :images="items"
      :products="false"
    />
  </div> -->
  <!-- <div class="absolute top-4 left-200">
    <UButton
      label="test"
      @click="console.log('test')"
    />
  </div> -->
</template>
