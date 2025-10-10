<script setup>
//
useTitle('Материалы')
useSeoMeta({
  description:
    'Полезные статьи и материалы по выбору, эксплуатации, поверке и калибровке измерительного инструмента. Нормативная документация - ГОСТы, ТУ.',
})
</script>

<template>
  <article class="mx-4 my-8">
    <header class="mb-8">
      <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Материалы</h1>
    </header>

    <section class="space-y-10">
      <div class="flex flex-wrap justify-around gap-4">
        <UButton
          to="/materials/standards"
          variant="outline"
          class="rounded-full px-6"
          size="xl">
          Нормативная документация - ГОСТы, ТУ
        </UButton>
        <UButton
          to="/materials/grsi"
          variant="outline"
          class="rounded-full px-6"
          size="xl">
          ФГИС ГРСИ: Описания типов и методики поверки
        </UButton>
      </div>
      <LazyHelperArticlesBlock hydrate-never />
    </section>
  </article>
</template>
