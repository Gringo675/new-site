<script setup>
//
defineProps({
  imgSrc: String,
  title: String,
  link: String,
})
</script>

<template>
  <NuxtLink
    :to="link"
    class="relative mx-auto">
    <img
      :src="imgSrc"
      :alt="title"
      class="w-full rounded-xl" />
    <div class="group absolute inset-0 flex items-center justify-center rounded-xl bg-black/10 p-4 hover:bg-black/30">
      <span
        class="rounded-lg bg-black/70 px-4 py-2 text-center text-2xl font-bold text-white shadow-lg group-hover:bg-black/80">
        {{ title }}
      </span>
    </div>
  </NuxtLink>
</template>
