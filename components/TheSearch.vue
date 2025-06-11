<script setup>
//
const searchState = reactive({
  query: '',
  pending: false,
  result: null,
  showResults: false,
})

const searchHelper = {
  queryLimit: 100,
  debounceTime: 1000,
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
      searchState.showResults = true
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
}
watch(
  () => searchState.query,
  () => searchHelper.handleQueryChange(),
)

const clearAll = () => {
  searchHelper.abortRequest()
  searchState.query = ''
  searchState.showResults = false
  searchState.result = null
  hideCatsMenu() // для модуля поиска в боковом меню
}

const goTo = async path => {
  clearAll()
  await navigateTo(path)
}

const onInputClick = e => {
  if (!searchState.showResults && searchState.result) searchState.showResults = true
  e.stopPropagation() // чтобы не закрывать открытые результаты
}
</script>

<template>
  <HelperPopupMenu
    v-model:open="searchState.showResults"
    class="w-112"
    contentClass="left-0 right-0"
  >
    <template #trigger>
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
        :ui="{
          base: 'bg-violet-100 focus:bg-violet-50',
        }"
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
    </template>
    <template #content>
      <div
        v-if="searchState.result.products.length > 0"
        class=""
      >
        <!-- categories -->
        <div class="flex flex-col items-start gap-y-1 p-2 pt-1">
          <div class="-mb-2 self-end text-sm font-semibold">Категории</div>
          <template v-for="cat in searchState.result.cats">
            <NuxtLink
              v-for="subCat in cat.children"
              class="text-sm leading-tight underline-offset-4 hover:underline"
              :to="`/catalog/${subCat.alias}`"
              @click="clearAll"
            >
              {{ subCat.name }}
            </NuxtLink>
          </template>
        </div>
        <!-- products -->
        <div class="flex flex-col items-start gap-y-1 rounded-lg bg-violet-50 p-2 pt-1">
          <div class="-mb-1 self-end text-sm font-semibold">Товары</div>
          <NuxtLink
            v-for="product in searchState.result.products"
            class="text-sm leading-tight underline-offset-4 hover:underline"
            :to="`/product/${product.alias}`"
            @click="clearAll"
          >
            {{ product.name }}
          </NuxtLink>
        </div>
        <div class="flex justify-between p-2">
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
            @click="searchState.showResults = false"
          />
        </div>
      </div>
      <div
        v-else
        class="bg-violet-100 p-2"
      >
        Нет результатов! Попробуйте изменить запрос.
      </div>
    </template>
  </HelperPopupMenu>
</template>
