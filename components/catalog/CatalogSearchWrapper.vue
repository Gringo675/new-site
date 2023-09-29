<script setup>
//
const props = defineProps({
  searchData: Object,
})

for (const cat of props.searchData.cats) {
  cat.active = true
  for (const subCat of cat.children) {
    subCat.active = true
    if (subCat.children) {
      for (const subSubCat of subCat.children) {
        subSubCat.active = true
      }
    }
  }
}
const cats = reactive(props.searchData.cats)

const activeProducts = computed(() => {
  console.log(`from activeProducts`)

  const inactiveCats = {}
  for (const cat of cats) {
    inactiveCats[cat.id] = []
    for (const subCat of cat.children) {
      if (!subCat.active) inactiveCats[cat.id].push(subCat.props)
      if (subCat.children) {
        for (const subSubCat of subCat.children) {
          if (!subSubCat.active) inactiveCats[cat.id].push(subSubCat.props)
        }
      }
    }
  }
  return props.searchData.products.filter(
    product => !inactiveCats[product.catId].some(activeProps => activeProps.every(prop => product.props.includes(prop)))
  )
})

const vIndeterminateChecked = (el, binding) => {
  // custom directive v-indeterminate-checked
  const targetCat = cats[binding.value]
  el.indeterminate =
    targetCat.children.some(subCat => subCat.active) && targetCat.children.some(subCat => !subCat.active)
  if (!el.indeterminate) el.checked = targetCat.children.every(subCat => subCat.active)
}

const inputsHandler = (inputValue, i1, i2, i3) => {
  // получает значение чекбокса и до трех индексов вложенности целевой категории
  console.log(`from inputsHandler`)
  cv(i1, i2, i3)
  let tCat = cats[i1] // target cat
  if (i2 !== undefined) tCat = tCat.children[i2]
  if (i3 !== undefined) tCat = tCat.children[i3]
  console.log(`tCat.name: ${JSON.stringify(tCat.name, null, 2)}`)
  tCat.active = inputValue
  tCat.indeterminate = false

  const changeChildren = cats => {
    for (const cat of cats) {
      cat.active = inputValue
      tCat.indeterminate = false
      if (cat.children) changeChildren(cat.children)
    }
  }
  if (tCat.children) changeChildren(tCat.children)

  // todo: changeParents
}
</script>

<template>
  <div>Найдено товаров: {{ searchData.products.length === 100 ? 'более' : '' }} {{ searchData.products.length }}</div>
  <!--    content wrapper-->
  <div class="flex mt-5">
    <!--      first column-->
    <div class="w-60 mr-4">
      <h2>В категориях:</h2>
      <label
        v-for="(cat, i1) of cats"
        class="block ml-2 bg-blue-100"
      >
        <input
          type="checkbox"
          :checked="cat.active"
          @input="inputsHandler($event.target.checked, i1)"
        />
        {{ cat.name }}
        <label
          v-for="(subCat, i2) of cat.children"
          class="block ml-4 bg-teal-100"
        >
          <input
            type="checkbox"
            :checked="subCat.active"
            @input="inputsHandler($event.target.checked, i1, i2)"
          />
          {{ subCat.name }}
          <label
            v-for="(subSubCat, i3) of subCat.children"
            class="block ml-4 bg-purple-100"
          >
            <input
              type="checkbox"
              :checked="subSubCat.active"
              @input="inputsHandler($event.target.checked, i1, i2, i3)"
            />
            {{ subSubCat.name }}
          </label>
        </label>
      </label>
    </div>
    <!--      second column-->
    <div class="w-full">
      <CatalogProductsWrapper :products="activeProducts" />
    </div>
  </div>
</template>
