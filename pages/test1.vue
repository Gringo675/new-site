<script setup>
//
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="wrapper m-4 grid w-[1200px] grid-flow-row-dense grid-cols-3 gap-2 bg-rose-700 p-2">
    <div class="bl1 row-span-2 bg-green-200">111</div>
    <div class="bl2 h-4 bg-blue-200">222</div>
    <div class="bl3 bbb row-span-2 h-11">333</div>
    <div class="bl4 bg-emerald-500">444</div>
  </div>
  <div class="p-4">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla eaque aliquid quasi iusto doloribus est labore
    laudantium soluta exercitationem odio vel voluptatibus natus facere repellat corrupti possimus, dolorum accusantium
    quam!
  </div>
  <TheTest />
</template>
