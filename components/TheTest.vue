<script setup>

// const {data, pending} = useAsyncData('someTest', () => {
//   return $fetch('/api/apiTest')
// })
const pending = false
</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <div v-if="pending"></div>
      <slot v-else>some fallback</slot>
    </Transition>
    <!--    <Transition name="page" mode="out-in">-->
    <!--      <slot v-if="ready" :data="data">some fallback</slot>-->
    <!--      <div v-else class="py-3 flex flex-col items-center justify-center cursor-progress">-->
    <!--        <div class="border-[16px] border-t-[#2578FBFF] border-r-[#42ecc8] border-b-[#f7ef72] border-l-[#f34a5f]-->
    <!--        rounded-full w-32 h-32 animate-[spin_2s_linear_infinite]">-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </Transition>-->
  </div>
</template>

