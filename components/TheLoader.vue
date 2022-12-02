<script setup>
const loader = useLoader().value
</script>

<template>
  <Transition name="transition-loader">
    <div v-show="loader.isActive" class="
       fixed left-0 right-0 top-0 bottom-0 z-50 bg-gray-300/60
       flex flex-col items-center justify-center cursor-progress
       ">
      <div class="
        border-[16px] border-t-[#2578FBFF] border-r-[#42ecc8] border-b-[#f7ef72] border-l-[#f34a5f]
        rounded-full w-32 h-32 animate-[spin_2s_linear_infinite]
        "></div>
    </div>
  </Transition>
</template>
