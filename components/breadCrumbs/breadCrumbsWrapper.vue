<script setup>
/**
 * Из категории передается id конечной категории (находим родителей)
 * Из продукта передается id основной категории и массив с подкатегориями (находятся на бэкэнде)
 */
const props = defineProps({
  catId: {
    type: Number,
    required: true,
  },
  productCats: {
    type: Array,
  },
})

const forProduct = props.productCats !== undefined

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
        siblings: forProduct
          ? undefined
          : cats.map(sCat => {
              return {
                alias: sCat.alias,
                name: sCat.name,
                current: sCat.id === cat.id,
              }
            }),
        children: forProduct
          ? undefined
          : cat.children?.map(cat => {
              return {
                alias: cat.alias,
                name: cat.name,
              }
            }),
      })
      return true
    }
    if (!forProduct && cat.children) {
      const isParent = createPath(cat.children)
      if (isParent) {
        catsPath.push({
          name: cat.name,
          alias: cat.alias,
          siblings: cats.map(sCat => {
            return {
              alias: sCat.alias,
              name: sCat.name,
              current: sCat.id === cat.id,
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
  <div class="flex items-center gap-x-2">
    <NuxtLink
      to="/catalog"
      title="В каталог"
    >
      <UIcon
        name="i-heroicons-home-solid"
        class="w-7 h-7 block"
      />
    </NuxtLink>
    <breadCrumbsItem
      v-for="(crumb, index) in catsPath"
      :crumb="crumb"
      :noLink="index === catsPath.length - 1 && !forProduct"
    />
    <!-- product subCats -->
    <template v-if="forProduct">
      <UIcon
        name="i-heroicons-slash"
        class="w-6 h-6"
      />
      <BreadCrumbsProductSubCat
        v-for="(subCat, i) in productCats"
        :subCat="subCat"
        :addSeparator="i !== productCats.length - 1"
      />
    </template>
  </div>

  <!-- category children wrapper -->
  <div
    v-if="catsPath[catsPath.length - 1].children"
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
