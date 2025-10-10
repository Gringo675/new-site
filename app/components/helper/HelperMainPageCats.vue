<script setup>
//

const favCats = [
  {
    title: 'Штангенциркули',
    link: 'shtangentsirkuli',
  },
  {
    title: 'Микрометры',
    link: 'mikrometry',
  },
  {
    title: 'Индикаторы',
    link: 'indikatory',
  },
  {
    title: 'Нутромеры',
    link: 'nutromery',
  },
  {
    title: 'Скобы',
    link: 'skoby',
  },
  {
    title: 'Стенкомеры, толщиномеры',
    link: 'stenkomery-tolshchinomery',
  },
  {
    title: 'Угломеры',
    link: 'uglomery',
  },
  {
    title: 'Угольники',
    link: 'ugolniki',
  },
  {
    title: 'Линейки',
    link: 'linejki',
  },

  {
    title: 'Призмы поверочные',
    link: 'prizmy-poverochnye',
  },
  {
    title: 'Штативы, стойки',
    link: 'shtativy-stojki',
  },
]
</script>

<template>
  <div class="xs:grid-cols-2 my-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
    <HelperImageLink
      v-for="cat in favCats"
      :key="cat.link"
      :img-name="cat.link"
      :img-dir="'/static/img/categories'"
      :title="cat.title"
      :link="`/catalog/${cat.link}`"
      class="max-w-100" />
    <NuxtLink
      to="/catalog/"
      class="group mx-auto flex w-full max-w-100 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 p-4 transition-colors hover:bg-violet-200">
      <span
        class="rounded-lg bg-black/70 px-4 py-2 text-center text-2xl font-bold text-white shadow-lg group-hover:bg-black/80">
        Все 100+ категорий
      </span>
    </NuxtLink>
  </div>
</template>
