<script setup>
//
const articles = [
  {
    img: 'choose_caliper',
    title: 'Как выбрать штангенциркуль?',
    link: '/materials/kak-vybrat-shtangentsirkul',
  },
  {
    img: 'choose_micrometr',
    title: 'Как выбрать микрометр?',
    link: '/materials/kak-vybrat-mikrometr',
  },
  {
    img: 'poverka',
    title: 'Что такое поверка?',
    link: '/materials/chto-takoe-poverka-instrumenta',
  },
  {
    img: 'kalibrovka',
    title: 'Что такое калибровка?',
    link: '/materials/chto-takoe-kalibrovka-instrumenta',
  },
]
</script>

<template>
  <HelperDivider text="Полезные статьи" />
  <div class="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2">
    <HelperImageLink
      v-for="art in articles"
      :key="art.link"
      :img-name="art.img"
      :img-dir="'/static/img/articles'"
      :title="art.title"
      :link="art.link" />
  </div>
</template>
