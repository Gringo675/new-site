<script setup>
//
useTitle('Интернет-магазин измерительных инструментов')

const catImgDir = '/static/img/categories/'
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

const advantages = [
  {
    icon: 'i-heroicons-trophy',
    title: '25+ лет опыта',
    description:
      'С 2000 года снабжаем клиентов по всей России современным измерительным инструментом и промышленным оборудованием.',
  },

  {
    icon: 'i-heroicons-truck',
    title: 'Доставка по России',
    description: 'Оперативная доставка транспортными компаниями и собственным автотранспортом — в любой регион страны.',
  },
  {
    icon: 'i-heroicons-building-office-2',
    title: 'Прямые поставки от производителей',
    description: 'Официальные дилерские и партнерские соглашения с заводами-изготовителями.',
  },
  {
    icon: 'i-heroicons-document-check',
    title: 'Поверка и калибровка',
    description: 'Организуем поверку и калибровку инструмента для гарантии точности и надежности.',
  },
  {
    icon: 'i-heroicons-shield-check',
    title: 'Гарантия качества',
    description: 'Только сертифицированный инструмент, соответствующий ГОСТам РФ и международным стандартам.',
  },
  {
    icon: 'i-heroicons-user-group',
    title: 'Личный подход',
    description: 'Индивидуальные условия, скидки и консультации для каждого клиента. Мы ценим ваше доверие!',
  },
]

const artImgDir = '/static/img/articles/'
const articles = [
  {
    img: 'choose_caliper.jpg',
    title: 'Как выбрать штангенциркуль?',
    link: '/materials/kak-vybrat-shtangentsirkul',
  },
  {
    img: 'choose_micrometr.jpg',
    title: 'Как выбрать микрометр?',
    link: '/materials/kak-vybrat-mikrometr',
  },
  {
    img: 'poverka.jpg',
    title: 'Что такое поверка?',
    link: '/materials/chto-takoe-poverka-instrumenta',
  },
  {
    img: 'kalibrovka.jpg',
    title: 'Что такое калибровка?',
    link: '/materials/chto-takoe-kalibrovka-instrumenta',
  },
]
</script>

<template>
  <PresentationBlock />
  <BestSellersBlock />
  <div class="xs:grid-cols-2 my-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
    <HelperImageLink
      v-for="cat in favCats"
      :key="cat.link"
      :img-src="`${catImgDir}${cat.link}.jpg`"
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
  <div class="my-12 grid gap-6 md:grid-cols-2">
    <HelperPresentationCard
      v-for="adv in advantages"
      :item="adv" />
  </div>

  <HelperDivider text="Полезные статьи" />
  <div class="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2">
    <HelperImageLink
      v-for="art in articles"
      :key="art.link"
      :img-src="`${artImgDir}${art.img}`"
      :title="art.title"
      :link="art.link" />
  </div>
</template>
