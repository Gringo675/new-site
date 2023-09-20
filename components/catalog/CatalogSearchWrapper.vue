<script setup>
//
const props = defineProps({
  searchData: Object,
})

for (const cat of props.searchData.cats) {
  for (const subCat of cat.childs) {
    subCat.active = true
  }
}
const cats = reactive(props.searchData.cats)

const activeProducts = computed(() => {
  const inactiveCats = {}
  for (const cat of cats) {
    inactiveCats[cat.id] = cat.childs.filter(child => !child.active).map(child => child.props)
  }
  return props.searchData.products.filter(
    product => !inactiveCats[product.catId].some(activeProps => activeProps.every(prop => product.props.includes(prop)))
  )
})

const vIndeterminateChecked = (el, binding) => {
  // custom directive v-indeterminate-checked
  const targetCat = cats[binding.value]
  el.indeterminate = targetCat.childs.some(subCat => subCat.active) && targetCat.childs.some(subCat => !subCat.active)
  if (!el.indeterminate) el.checked = targetCat.childs.every(subCat => subCat.active)
}
</script>

<template>
  <div>Найдено {{ searchData.products.length }} товаров в {{ searchData.cats.length }} категориях.</div>
  <!--    content wrapper-->
  <div class="flex mt-5">
    <!--      first column-->
    <div class="w-60 mr-4">
      <label
        v-for="(cat, i) of cats"
        class="block ml-2"
      >
        <input
          type="checkbox"
          v-indeterminate-checked="i"
          @change="cat.childs.forEach(subCat => (subCat.active = $event.target.checked))"
        />
        {{ cat.name }}
        <label
          v-for="subCat of cat.childs"
          class="block ml-4"
        >
          <input
            type="checkbox"
            v-model="subCat.active"
          />
          {{ subCat.name }}
        </label>
      </label>
    </div>
    <!--      second column-->
    <div class="w-full">
      <CatalogProductsWrapper :products="activeProducts" />
    </div>
  </div>
</template>
