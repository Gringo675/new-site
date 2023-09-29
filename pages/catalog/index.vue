<script setup>
// todo: no sub-sub cats
const cats = JSON.parse(JSON.stringify(await useCats())) // unReactive
</script>

<template>
  <div class="catalog">
    <h1>CATALOG</h1>
    <div class="flex flex-wrap">
      <!--      категория-->
      <div
        v-for="cat in cats"
        class="w-80 bg-slate-100 m-2 p-2 rounded-md shadow-md"
      >
        <NuxtLink
          :to="'/catalog/' + cat.alias"
          class=""
        >
          <img :src="'https://chelinstrument.ru/components/com_jshopping/files/img_categories/' + cat.image" />
          <span class="text-xl text-center block w-full">{{ cat.name }}</span>
        </NuxtLink>
        <!--        подкатегория-->
        <div
          v-for="child in cat.children"
          class="bg-slate-200"
        >
          <NuxtLink
            :to="'/catalog/' + child.alias"
            class="flex items-center my-1"
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
