<script setup>
const images = [
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
]
const img = ref(null)
const onClick = () => {
  img.value.style.transform = 'scale(3)'
}
</script>

<template>
  <!-- <div class="viewer-box w-[500px] max-w-full bg-blue-200">
    <ImageViewerInline :images="images" />
  </div> -->
  <div class="parent">
    <img
      ref="img"
      @click="onClick"
      src="https://chelinstrument.ru/components/com_jshopping/files/img_products/SHC1STIZ.jpg"
      alt=""
      class="border-red-300 border-2"
    />
  </div>
</template>
