<script setup>
//
const searchState = reactive({
  pending: false,
  showResults: false,
  query: '',
  data: null,
})
const searchHelper = {
  timer: null,
  activeRequests: 0,
  showAllActive: false,
}

const debounceSearch = () => {
  // todo: reset data?
  searchHelper.showAllActive = false
  clearTimeout(searchHelper.timer)
  if (searchState.query.length > 2) searchHelper.timer = setTimeout(getSearch, 1000)
}
const getSearch = async () => {
  try {
    searchHelper.activeRequests++
    searchState.pending = true
    const response = await $fetch(`/api/getSearch?q=${searchState.query}&f=1`)
    searchHelper.activeRequests--
    if (searchHelper.activeRequests > 0) return // за время ожидания ответа был запущен другой запрос
    searchState.pending = false
    searchState.data = response
    if (!searchState.showResults && !searchHelper.showAllActive) showSearchResults()
  } catch (e) {
    showNotice('Ошибка при поисковом запросе!', 'error')
    searchState.pending = false
    searchState.showResults = false
    searchState.data = null
  }
}

const hideSearchResults = () => {
  searchState.showResults = false
}

const showSearchResults = () => {
  searchState.showResults = true
  document.body.addEventListener('click', hideSearchResults, { once: true })
}

const onInputClick = () => {
  if (!searchState.showResults && searchState.data) showSearchResults()
}

const showAllResults = async () => {
  searchHelper.showAllActive = true
  hideSearchResults()
  await navigateTo(`/search/${searchState.query}`)
}
</script>

<template>
  <div class="m-2 p-2 w-64 relative">
    <input
      class="pl-2 pr-6 py-1 w-full"
      type="text"
      placeholder="Поиск по каталогу"
      v-model="searchState.query"
      @input="debounceSearch"
      @click.stop="onInputClick"
      @keyup.enter="showAllResults"
    />
    <!-- spinner -->
    <span
      v-if="searchState.pending"
      class="absolute right-4"
      >...</span
    >
    <!-- search results -->
    <Transition name="transition-fade">
      <div
        v-if="searchState.showResults"
        class="absolute w-[450px] max-h-[300px] overflow-auto border border-slate-400 rounded-md p-2 bg-slate-50 z-10"
      >
        <div
          v-if="searchState.data"
          class=""
        >
          <!-- categories -->
          <div class="">
            <div>Категории:</div>
            <div
              v-for="cat in searchState.data.cats"
              class=""
            >
              <NuxtLink :to="'/catalog/' + cat.alias">
                {{ cat.name }}
              </NuxtLink>
              <NuxtLink
                v-for="subCat in cat.childs"
                :to="'/catalog/' + subCat.alias"
                class="pl-2 block"
              >
                {{ subCat.name }}
              </NuxtLink>
            </div>
          </div>
          <!-- products -->
          <div class="">
            <div>Товары:</div>
            <NuxtLink
              v-for="product in searchState.data.products"
              :to="'/product/' + product.alias"
              class="block"
            >
              {{ product.name }}
            </NuxtLink>
          </div>
        </div>
        <div
          v-else
          class=""
        >
          По запросу ' {{ searchState.query }}' нет совпадений! Попробуйте изменить поисковую фразу.
        </div>
      </div>
    </Transition>
  </div>
</template>
