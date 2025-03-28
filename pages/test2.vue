<script setup>
//
const productCats = reactive({
  name: 'Индикаторы',
  children: [
    {
      name: 'Индикаторы цифровые',
    },
    {
      name: 'Индикаторы высокоточные',
      children: [
        {
          name: 'Индикаторы высокоточные цифровые',
        },
      ],
    },
    {
      name: 'Индикаторы ЧИЗ',
      children: [
        {
          name: 'Индикаторы ЧИЗ цифровые',
        },
        {
          name: 'Индикаторы ЧИЗ с точностью 0.001 мм',
        },
        {
          name: 'Индикаторы ЧИЗ с диапазоном до 10 мм',
        },
      ],
    },
  ],
})
</script>

<template>
  <!-- <h1>Индикатор цифровой ИЧЦ-10 0.001 ЧИЗ</h1> -->
  <div class="wrapper m-4 rounded-lg border border-gray-400 bg-gray-200 p-2">
    <TheTest :item="productCats" />
  </div>
</template>
