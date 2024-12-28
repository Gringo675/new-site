<script setup>
const props = defineProps({
  forMenu: {
    type: Boolean,
    default: false,
  },
})
const searchState = reactive({
  query: '',
  pending: false,
  result: null,
  showResults: false,
})

onMounted(() => {
  if (props.forMenu) {
    // @ts-ignore
    searchHelper.overlayEl = document.querySelector('.menu-wrapper')
  }
})

const searchHelper = {
  queryLimit: 100,
  debounceTime: 1000,
  overlayEl: window, // куда вешать обработчик для закрытия
  controller: new AbortController(),
  handleQueryChange() {
    if (searchState.query.length > this.queryLimit) {
      searchState.query = searchState.query.slice(0, this.queryLimit)
      showNotice({
        title: 'Слишком длинный запрос!',
        description: `Длина запроса превысила установленный лимит в ${this.queryLimit} символов.`,
        type: 'error',
      })
    }
    searchState.result = null
    searchState.showResults = false
    this.controller.abort('manualAbort') // set 'cause' param
    if (searchState.query.length > 2) this.startingNewRequest()
  },
  async startingNewRequest() {
    this.controller = new AbortController()
    try {
      await new Promise((resolve, reject) => {
        this.controller.signal.addEventListener('abort', () => reject({ cause: 'manualAbort' }))
        setTimeout(resolve, this.debounceTime)
      })
      searchState.pending = true
      searchState.result = await $fetch(`/api/getSearch?q=${searchState.query}&f=1`, {
        signal: this.controller.signal,
      })
      this.activateSearchResults()
    } catch (err) {
      if (err.cause !== 'manualAbort') {
        showNotice({
          title: 'Не удалось выполнить поиск!',
          description: `Ошибка при получении данных. Попробуйте ещё раз.`,
          type: 'error',
        })
      }
    } finally {
      searchState.pending = false
    }
  },
  activateSearchResults() {
    searchState.showResults = true
    this.overlayEl.addEventListener('click', this.hideSearchResults, { once: true })
  },
  hideSearchResults() {
    searchState.showResults = false
  },
}
watch(
  () => searchState.query,
  () => searchHelper.handleQueryChange()
)

const goTo = async url => {
  searchState.showResults = false
  await navigateTo(url)
}

const onInputClick = e => {
  if (!searchState.showResults && searchState.result) searchHelper.activateSearchResults()
  e.stopPropagation()
}
</script>

<template>
  <div class="relative m-2">
    <UInput
      v-model="searchState.query"
      color="primary"
      variant="outline"
      placeholder="Поиск по каталогу"
      leading-icon="i-heroicons-magnifying-glass-20-solid"
      :loading="searchState.pending"
      :ui="{ icon: { trailing: { pointer: '' } } }"
      size="md"
      class="w-[450px] z-[21]"
      inputClass="bg-slate-100"
      @keyup.enter="goTo(`/search/${searchState.query}`)"
      @click="onInputClick"
    >
      <template #trailing>
        <UButton
          v-show="searchState.query !== ''"
          color="gray"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          @click="searchState.query = ''"
        />
      </template>
    </UInput>
    <!-- search results -->
    <Transition name="transition-above">
      <div
        v-if="searchState.showResults"
        @click.stop
        class="absolute w-[450px] mt-1 overflow-auto border border-green-600 rounded-md z-20 shadow-xl"
      >
        <div
          v-if="searchState.result.products.length > 0"
          class=""
        >
          <!-- categories -->
          <div class="flex flex-col items-start gap-y-1 p-2 pt-1 bg-slate-200">
            <div class="text-sm self-end -mb-2">Категории</div>
            <template v-for="cat in searchState.result.cats">
              <UButton
                v-for="subCat in cat.children"
                variant="link"
                :padded="false"
                color="indigo"
                truncate
                :label="subCat.name"
                @click="goTo(`/catalog/${subCat.alias}`)"
              />
            </template>
          </div>
          <!-- products -->
          <div class="flex flex-col items-start gap-y-1 p-2 pt-1 bg-slate-50">
            <div class="text-sm self-end -mb-2">Товары</div>
            <UButton
              v-for="product in searchState.result.products"
              variant="link"
              :padded="false"
              color="indigo"
              truncate
              :label="product.name"
              @click="goTo(`/product/${product.alias}`)"
            />
          </div>
          <div class="bg-slate-300 p-2 flex justify-between">
            <UButton
              variant="ghost"
              color="indigo"
              label="Все результаты"
              @click="goTo(`/search/${searchState.query}`)"
            />
            <UButton
              color="gray"
              variant="link"
              icon="i-heroicons-arrow-long-up-16-solid"
              :padded="false"
              @click="searchHelper.hideSearchResults"
            />
          </div>
        </div>
        <div
          v-else
          class="bg-slate-50 p-2"
        >
          Нет результатов! Попробуйте изменить запрос.
        </div>
      </div>
    </Transition>
  </div>
</template>
