<script setup>
// todo: no sub-sub cats

useTitle('Каталог инструмента')
const { data: cats } = await useCats()
</script>

<template>
  <div class="catalog">
    <h1>CATALOG</h1>
    <div class="flex flex-wrap">
      <!--      категория-->
      <div
        v-for="cat in cats"
        class="m-2 w-80 rounded-md bg-slate-100 p-2 shadow-md"
      >
        <NuxtLink
          :to="'/catalog/' + cat.alias"
          class=""
        >
          <img :src="'https://chelinstrument.ru/components/com_jshopping/files/img_categories/' + cat.image" />
          <span class="block w-full text-center text-xl">{{ cat.name }}</span>
        </NuxtLink>
        <!--        подкатегория-->
        <div
          v-for="child in cat.children"
          class="bg-slate-200"
        >
          <NuxtLink
            :to="'/catalog/' + child.alias"
            class="my-1 flex items-center"
          >
            <img
              :src="'https://chelinstrument.ru/components/com_jshopping/files/img_categories/' + child.image"
              class="w-10"
            />
            <span class="ml-2">{{ child.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
