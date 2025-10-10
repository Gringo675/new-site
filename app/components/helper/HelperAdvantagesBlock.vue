<script setup>
//
const advantages = [
  {
    icon: 'i-heroicons-trophy',
    title: '25+ лет опыта',
    description:
      'С 2000 года снабжаем клиентов по всей России современным измерительным инструментом и промышленным оборудованием.',
  },
  {
    icon: 'i-heroicons-archive-box',
    title: 'Более 5 000 позиций',
    description:
      'Широкий ассортимент продукции от ведущих российских и зарубежных производителей — для любых задач и отраслей.',
  },
  {
    icon: 'i-heroicons-shield-check',
    title: 'Гарантия качества',
    description: 'Только сертифицированный инструмент, соответствующий ГОСТам РФ и международным стандартам.',
  },
  {
    icon: 'i-heroicons-truck',
    title: 'Доставка по всей России',
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
    icon: 'i-heroicons-bolt',
    title: 'Минимальные сроки поставки',
    description: 'Быстрая комплектация и отгрузка — получение продукции на складе сразу после оплаты.',
  },
  {
    icon: 'i-heroicons-user-group',
    title: 'Персональный подход',
    description: 'Индивидуальные условия, скидки и консультации для каждого клиента. Мы ценим ваше доверие!',
  },
]
</script>

<template>
  <div class="my-12">
    <HelperDivider text="Всегда для вас" />
    <div class="grid gap-6 md:grid-cols-2">
      <HelperPresentationCard
        v-for="adv in advantages"
        :item="adv" />
    </div>
  </div>
</template>
