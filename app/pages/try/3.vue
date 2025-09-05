<template>
  <NuxtErrorBoundary @error="someErrorLogger">
    <UModal
      v-model="isOpen"
      fullscreen
      :ui="{
        base: 'items-center',
        background: '',
        overlay: {
          background: 'bg-gray-800/75',
        },
      }"
    >
      <UAlert
        color="green"
        variant="solid"
        description="Wait. The page will reload automatically until an error appears."
        class="m-2"
      />
      <UCarousel
        :items="images"
        :ui="{
          item: 'basis-full justify-center p-2',
          indicators: {
            wrapper: 'relative bottom-0 mt-4 overflow-auto items-stretch',
          },
        }"
        indicators
      >
        <template #default="{ item }">
          <img
            :src="item"
            class="border border-blue-700 w-min min-w-10 object-contain shrink"
            draggable="false"
          />
        </template>

        <template #indicator="{ onClick, page, active }">
          <UButton
            :label="String(page)"
            :variant="active ? 'solid' : 'outline'"
            size="2xs"
            class="rounded-full min-w-6 justify-center"
            @click="onClick(page)"
          />
        </template>
      </UCarousel>
    </UModal>
    <template #error="{ error, clearError }">
      <UAlert
        color="red"
        variant="solid"
        title="Error!"
        :description="error"
        class="m-2"
      />
    </template>
  </NuxtErrorBoundary>
</template>

<script setup>
definePageMeta({
  layout: 'empty',
})

const isOpen = ref(false)
let timer

const someErrorLogger = e => {
  console.error(`captured error: ${JSON.stringify(e.message, null, 2)}`)
  clearTimeout(timer)
}

onMounted(() => {
  setTimeout(() => {
    isOpen.value = true
  }, 1000)
  timer = setTimeout(() => {
    location.reload()
  }, 3000)
})

const images = ['http://via.placeholder.com/900x300', 'http://via.placeholder.com/900x300']
</script>
