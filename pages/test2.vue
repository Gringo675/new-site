<script setup>
//
import { TheTest } from '#components'
definePageMeta({
  layout: 'empty',
})

const slideover = useSlideover()
const count = ref(0)
function openSlideover() {
  count.value += 1
  slideover.open(TheTest, {
    count: count.value,
    onClose: slideover.close,
  })
}
</script>

<template>
  <UButton
    label="Reveal slideover"
    @click="openSlideover"
  />
  <div class="w-40 h-28 bg-red-200 xs:bg-green-200"></div>

  <div class="mt-5 ml-2 w-[1200px] grid grid-cols-12 gap-x-2 bg-green-200">
    <div class="order-1 col-span-2 row-span-2 bg-red-200">1</div>
    <div class="order-3 col-span-8 bg-blue-200">2</div>
    <div class="order-2 col-span-2 bg-yellow-200">3</div>
    <div class="order-4 col-span-3 bg-orange-200">4</div>
    <div class="order-5 col-span-2 bg-red-200">5</div>
    <div class="order-6 col-span-5 bg-orange-200">6</div>
  </div>
</template>
