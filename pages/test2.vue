<script setup>
//
definePageMeta({
  layout: 'empty',
})

const expand = ref(false)
</script>

<template>
  <div class="m-5 w-50">
    <div class="overflow-hidden rounded-lg border border-orange-300 bg-orange-200">
      <div class="flex items-center justify-between px-2">
        <span class="text-lg">Filter name</span>
        <UButton
          icon="i-heroicons-chevron-down"
          class="m-1 p-1"
          @click="expand = !expand"
          :class="{ 'rotate-over': expand }"
        />
      </div>
      <div
        class="overflow-hidden bg-orange-100 transition-[max-height] duration-500 ease-out"
        :class="expand ? 'max-h-50' : 'max-h-0'"
      >
        <div class="menu-scrollbar m-2 mr-1 max-h-46 overflow-auto pr-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis minima nesciunt dolor error, consequuntur,
          quibusdam vitae architecto, corrupti earum fuga voluptatibus officia expedita alias. Amet tempore odio odit
          dolores aliquid. Lorem ipsum dolor sit amet consectetur adipisicing elit. In minus iure eos fugit dolorem
          voluptas, sit ipsam rem minima ex enim ab amet eius cupiditate quos magni sed quibusdam autem!
        </div>
      </div>
    </div>
  </div>
</template>
