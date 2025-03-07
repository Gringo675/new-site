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
    <NuxtLink to="/catalog"> Весь каталог </NuxtLink>
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
    class="relative mt-5 p-3 bg-gray-100 rounded-lg border border-gray-200"
  >
    <div
      class="absolute -top-3 left-8 px-2 py-1 text-sm leading-none bg-gray-100 rounded-full border border-gray-200 after:absolute after:-inset-x-px after:top-1/2 after:-bottom-px after:bg-gray-100"
    >
      <span class="relative -top-0.5 z-10">Категории</span>
    </div>
    <div class="@container flex flex-wrap gap-3">
      <UButton
        v-for="child in catsPath[catsPath.length - 1].children"
        :label="child.name"
        :to="'/catalog/' + child.alias"
        variant="outline"
        :ui="{ rounded: 'rounded-full' }"
        class="justify-center text-center w-full @sm:w-auto @sm:max-w-[calc(50%-0.375rem)]"
      />
    </div>
  </div>
</template>
