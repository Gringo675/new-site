<script setup>
// todo: no sub-sub cats

useTitle('Каталог инструмента')
const { data: cats } = await useCats()
</script>

<template>
  <div class="my-8">
    <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Каталог инструментов</h1>
    <div
      class="mx-auto mt-6 grid max-w-screen-lg grid-cols-1 items-start gap-6 md:grid-cols-[340px_1fr] lg:grid-cols-[400px_1fr]">
      <template v-for="cat in cats">
        <HelperImageLink
          class="max-w-100"
          :img-name="cat.alias"
          :img-dir="'/static/img/categories'"
          :title="cat.name"
          :link="'/catalog/' + cat.alias" />
        <ul class="ml-4 list-disc space-y-2 pl-6 md:ml-0">
          <template v-for="child in cat.children">
            <li>
              <NuxtLink
                :to="'/catalog/' + child.alias"
                class="underline-offset-4 hover:underline"
                >{{ child.name }}</NuxtLink
              >
            </li>
            <template v-if="child.children">
              <li
                v-for="subChild in child.children"
                class="ml-4">
                <NuxtLink
                  :to="'/catalog/' + subChild.alias"
                  class="underline-offset-4 hover:underline"
                  >{{ subChild.name }}</NuxtLink
                >
              </li>
            </template>
          </template>
        </ul>
      </template>
    </div>
  </div>
</template>
