<script setup>
//
const props = defineProps({
  imgName: String,
  imgDir: String,
  title: String,
  link: String,
})
</script>

<template>
  <NuxtLink
    no-prefetch
    :to="link"
    class="relative mx-auto">
    <picture>
      <source
        type="image/avif"
        :srcset="`
          ${imgDir}/w_400/${imgName}.avif 400w,
          ${imgDir}/w_800/${imgName}.avif 800w,
        `"
        sizes="400px" />
      <source
        type="image/webp"
        :srcset="`
          ${imgDir}/w_400/${imgName}.webp 400w,
          ${imgDir}/w_800/${imgName}.webp 800w,
        `"
        sizes="400px" />
      <img
        :src="`${imgDir}/w_400/${imgName}.jpg`"
        :srcset="`
          ${imgDir}/w_400/${imgName}.jpg 400w,
          ${imgDir}/w_800/${imgName}.jpg 800w,
        `"
        sizes="400px"
        :alt="title"
        loading="lazy"
        decoding="async"
        width="400"
        height="135"
        class="h-auto w-full rounded-xl" />
    </picture>
    <div class="group absolute inset-0 flex items-center justify-center rounded-xl bg-black/10 p-4 hover:bg-black/30">
      <span
        class="rounded-lg bg-black/70 px-4 py-2 text-center text-2xl font-bold text-white shadow-lg group-hover:bg-black/80">
        {{ title }}
      </span>
    </div>
  </NuxtLink>
</template>
