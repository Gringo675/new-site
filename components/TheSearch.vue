<script setup>
//
const hideCatsMenu = () => {}
const searchState = reactive({
  query: '',
  pending: false,
  result: null,
  showResults: false,
  ref: useTemplateRef('search-ref'),
})

const searchHelper = {
  queryLimit: 100,
  debounceTime: 1000,
  // overlayEl: window, // куда вешать обработчик для закрытия
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
    this.abortRequest()
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
  abortRequest() {
    this.controller.abort('manualAbort') // set 'cause' param
  },
  activateSearchResults() {
    searchState.showResults = true
    const inputRect = searchState.ref.getBoundingClientRect()
    searchState.ref.style.setProperty(
      '--result-width',
      `${window.innerWidth > 450 ? inputRect.width : window.innerWidth - 10}px`,
    )
    searchState.ref.style.setProperty('--result-left', `${window.innerWidth > 450 ? inputRect.left : 5}px`)
    // searchState.ref.style.setProperty('--result-width', `${inputRect.width}px`)
    // searchState.ref.style.setProperty('--result-left', `${inputRect.left}px`)
    searchState.ref.style.setProperty('--result-max-height', `${window.innerHeight - inputRect.bottom - 10}px`)
    searchState.ref.style.setProperty('--result-top', `${inputRect.bottom}px`)
  },
  hideSearchResults() {
    searchState.showResults = false
  },
}
watch(
  () => searchState.query,
  () => searchHelper.handleQueryChange(),
)

const goTo = async link => {
  searchHelper.abortRequest()
  searchHelper.hideSearchResults()
  hideCatsMenu() // для модуля поиска в боковом меню
  await navigateTo(link)
}

const onInputClick = e => {
  if (!searchState.showResults && searchState.result) searchHelper.activateSearchResults()
  // e.stopPropagation()
}
</script>

<template>
  <div
    class="w-[450px]"
    ref="search-ref"
  >
    <UInput
      v-model="searchState.query"
      color="primary"
      variant="outline"
      highlight
      placeholder="Поиск по каталогу"
      leading-icon="i-heroicons-magnifying-glass-20-solid"
      :loading="searchState.pending"
      size="md"
      class="z-21 w-full"
      inputClass="bg-slate-100"
      @keyup.enter="goTo(`/search/${searchState.query}`)"
      @click="onInputClick"
    >
      <template
        v-if="searchState.query.length"
        #trailing
      >
        <UButton
          color="neutral"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          class="p-0"
          @click="searchState.query = ''"
        />
      </template>
    </UInput>
    <!-- search results -->
    <Transition name="transition-fade">
      <div
        v-if="searchState.showResults"
        class="fixed top-0 left-0 z-20 h-full w-full bg-black/20"
        @click="searchHelper.hideSearchResults"
      >
        <div
          @click.stop
          class="modal-form absolute top-[var(--result-top)] left-[var(--result-left)] z-20 mt-1 max-h-[var(--result-max-height)] w-[var(--result-width)] overflow-auto rounded-md border border-violet-600 shadow-xl"
        >
          <div
            v-if="searchState.result.products.length > 0"
            class=""
          >
            <!-- categories -->
            <div class="flex flex-col items-start gap-y-1 bg-slate-200 p-2 pt-1">
              <div class="-mb-2 self-end text-sm">Категории</div>
              <template v-for="cat in searchState.result.cats">
                <UButton
                  v-for="subCat in cat.children"
                  variant="link"
                  color="tertiary"
                  truncate
                  :label="subCat.name"
                  class="p-0"
                  @click="goTo(`/catalog/${subCat.alias}`)"
                />
              </template>
            </div>
            <!-- products -->
            <div class="flex flex-col items-start gap-y-1 bg-slate-50 p-2 pt-1">
              <div class="-mb-2 self-end text-sm">Товары</div>
              <UButton
                v-for="product in searchState.result.products"
                variant="link"
                class="p-0"
                color="tertiary"
                truncate
                :label="product.name"
                @click="goTo(`/product/${product.alias}`)"
              />
            </div>
            <div class="flex justify-between bg-slate-300 p-2">
              <UButton
                variant="ghost"
                color="tertiary"
                label="Все результаты"
                @click="goTo(`/search/${searchState.query}`)"
              />
              <UButton
                color="neutral"
                variant="link"
                icon="i-heroicons-x-mark"
                class="p-0"
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
      </div>
    </Transition>
  </div>
</template>
