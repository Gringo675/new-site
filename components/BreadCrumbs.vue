<script setup>
//
const props = defineProps({
  catId: Number,
})
const { data: cats } = await useCats()
// console.log(`cats.value: ${JSON.stringify(cats.value, null, 2)}`)
const catsPath = []
let catChildren = []
const createPath = cats => {
  for (const cat of cats) {
    if ((cat.id = props.catId)) {
      // нашли нашу категорию
      catsPath.push({
        name: cat.name,
        siblings: cats.filter(cat => cat.id !== props.catId),
      })
      catChildren = cat.children
      return true
    }
    if (cat.children !== undefined) {
      const isParent = createPath(cat.children)
      if (isParent) {
        catsPath.push({
          name: cat.name,
          alias: cat.alias,
          siblings: cats.filter(cat => cat.id !== props.catId),
        })
        return true
      }
    }
  }
  return false
}
createPath(cats.value)
// console.log(`catsPath: ${JSON.stringify(catsPath, null, 2)}`)
</script>

<template>
  <div class="my-2 px-3 w-fit bg-slate-300 rounded-md flex">
    <div><NuxtLink to="/">Home</NuxtLink></div>
    <!-- <div v-for="crumb in breadCrumbs">
      <span class="px-2">/</span>
      <NuxtLink :to="crumb.link">{{ crumb.name }}</NuxtLink>
    </div> -->
  </div>
</template>

<style></style>
