<script setup>
//
</script>

<template>
  <article class="mx-4 my-8">
    <header class="mb-8">
      <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Материалы</h1>
    </header>

    <section class="space-y-10">
      <ul class="space-y-4">
        <li>
          <UButton
            to="/materials/articles"
            variant="outline"
            class="rounded-full px-6"
            size="xl"
          >
            Статьи
          </UButton>
        </li>
        <li>
          <UButton
            to="/materials/standards"
            variant="outline"
            class="rounded-full px-6"
            size="xl"
          >
            ГОСТы, ТУ
          </UButton>
        </li>
        <li>
          <UButton
            to="/materials/grsi"
            variant="outline"
            class="rounded-full px-6"
            size="xl"
          >
            ФГИС ГРСИ: Описания типов и методики поверки
          </UButton>
        </li>
      </ul>
    </section>
  </article>
</template>
