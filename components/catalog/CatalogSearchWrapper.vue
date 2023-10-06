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
  // идеального алгоритма нет, нужно либо убирать неактивные, либо вычислять активные
  // убираем неактивные
  // const inactiveCats = {}
  // for (const cat of cats) {
  //   inactiveCats[cat.id] = []
  //   for (const subCat of cat.children) {
  //     if (!subCat.active) inactiveCats[cat.id].push(subCat.props)
  //     if (subCat.children) {
  //       for (const subSubCat of subCat.children) {
  //         if (!subSubCat.active) inactiveCats[cat.id].push(subSubCat.props)
  //       }
  //     }
  //   }
  // }
  // return props.searchData.products.filter(
  //   product => !inactiveCats[product.catId].some(activeProps => activeProps.every(prop => product.props.includes(prop)))
  // )
  // вычисляем активные
  const activeCats = {}
  for (const cat of cats) {
    activeCats[cat.id] = []
    for (const subCat of cat.children) {
      if (subCat.active) activeCats[cat.id].push(subCat.props)
      if (subCat.children) {
        for (const subSubCat of subCat.children) {
          if (subSubCat.active) activeCats[cat.id].push(subSubCat.props)
        }
      }
    }
  }
  return props.searchData.products.filter(product =>
    activeCats[product.catId].some(activeProps => activeProps.every(prop => product.props.includes(prop)))
  )
})

const inputsHandler = (inputValue, indexes) => {
  // получает значение чекбокса и массив из индексов вложенности целевой категории
  console.log(`from inputsHandler`)

  const getCatFromIndexes = indexes => {
    switch (indexes.length) {
      case 1:
        return cats[indexes[0]]
      case 2:
        return cats[indexes[0]].children[indexes[1]]
      case 3:
        return cats[indexes[0]].children[indexes[1]].children[indexes[2]]
    }
  }

  const tCat = getCatFromIndexes(indexes) // target cat
  tCat.active = inputValue
  tCat.indeterminate = false

  const changeChildren = cats => {
    for (const cat of cats) {
      cat.active = inputValue
      cat.indeterminate = false
      if (cat.children) changeChildren(cat.children)
    }
  }
  if (tCat.children) changeChildren(tCat.children)

  const changeParent = indexes => {
    const cat = getCatFromIndexes(indexes)
    console.log(`from changeParent`)
    cat.indeterminate =
      cat.children.some(subCat => subCat.indeterminate) ||
      (cat.children.some(subCat => subCat.active) && cat.children.some(subCat => !subCat.active))
    if (cat.children.every(subCat => !subCat.active)) cat.active = false
    else if (cat.indeterminate || cat.children.every(subCat => subCat.active)) cat.active = true

    if (indexes.length > 1) changeParent(indexes.slice(0, -1))
  }
  if (indexes.length > 1) changeParent(indexes.slice(0, -1))
}
</script>

<template>
  <div>Найдено товаров: {{ searchData.products.length === 100 ? 'более' : '' }} {{ searchData.products.length }}</div>
  <!--    content wrapper-->
  <div class="flex mt-5">
    <!--      first column-->
    <div class="w-60 mr-4">
      <h2>В категориях:</h2>
      <template v-for="(cat, i1) of cats">
        <label class="block ml-2 bg-blue-100">
          <input
            type="checkbox"
            :checked="cat.active"
            @input="inputsHandler($event.target.checked, [i1])"
            :indeterminate="cat.indeterminate"
          />
          {{ cat.name }}
        </label>
        <template v-for="(subCat, i2) of cat.children">
          <label class="block ml-2 pl-2 bg-teal-100">
            <input
              type="checkbox"
              :checked="subCat.active"
              @input="inputsHandler($event.target.checked, [i1, i2])"
            />
            {{ subCat.name }}
          </label>
          <template v-for="(subSubCat, i3) of subCat.children">
            <label class="block ml-2 pl-4 bg-purple-100">
              <input
                type="checkbox"
                :checked="subSubCat.active"
                @input="inputsHandler($event.target.checked, [i1, i2, i3])"
              />
              {{ subSubCat.name }}
            </label>
          </template>
        </template>
      </template>
    </div>
    <!--      second column-->
    <div class="w-full">
      <CatalogProductsWrapper :products="activeProducts" />
    </div>
  </div>
</template>
