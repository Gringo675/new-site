<script setup>
//
const props = defineProps({
  catId: {
    type: Number,
    required: true,
  },
  forProduct: {
    type: Boolean,
    default: false,
  },
})

const { data: cats } = await useCats()
const catsPath = []
createPath(cats.value)
function createPath(cats) {
  for (const cat of cats) {
    if (cat.id === props.catId) {
      // нашли нашу категорию
      catsPath.push({
        name: cat.name,
        alias: cat.alias,
        siblings: cats
          .filter(cat => cat.id !== props.catId)
          .map(cat => {
            return {
              alias: cat.alias,
              name: cat.name,
            }
          }),
        children: cat.children?.map(cat => {
          return {
            alias: cat.alias,
            name: cat.name,
          }
        }),
      })
      return true
    }
    if (cat.children) {
      const isParent = createPath(cat.children)
      if (isParent) {
        catsPath.push({
          name: cat.name,
          alias: cat.alias,
          siblings: cats
            .filter(sCat => sCat.id !== cat.id)
            .map(cat => {
              return {
                alias: cat.alias,
                name: cat.name,
              }
            }),
        })
        return true
      }
    }
  }
  return false
}
catsPath.reverse()
</script>

<template>
  <!-- crumbs wrapper -->
  <div class="flex">
    <div>
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span class="ml-2">></span>
    </div>
    <breadCrumbsItem
      v-for="(crumb, index) in catsPath"
      :crumb="crumb"
      :noLink="index === catsPath.length - 1 && !forProduct"
    />
  </div>
  <!-- children wrapper -->
  <div
    v-if="!forProduct && catsPath[catsPath.length - 1].children"
    class="flex flex-wrap"
  >
    <NuxtLink
      v-for="child in catsPath[catsPath.length - 1].children"
      class="leading-5 rounded border border-gray-400 my-2 mr-2 p-1 w-[250px] text-center"
      :to="'/catalog/' + child.alias"
      >{{ child.name }}</NuxtLink
    >
  </div>
</template>
