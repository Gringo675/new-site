<script setup>
// хелпер для поиска по каталогу и пункта доставки

const props = defineProps({
  cargoSearch: {
    type: Boolean,
    default: false,
  },
})

const options = {
  searchAPI: props.cargoSearch ? '/api/dellin/getCities?q=' : '/api/getSearch?f=1&q=',
}

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
      searchState.result = await $fetch(options.searchAPI + searchState.query, {
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
  !props.cargoSearch && hideCatsMenu() // для модуля поиска в боковом меню при поиске по каталогу
}

// const goTo = async path => {
//   clearAll()
//   await navigateTo(path)
// }

const onInputClick = e => {
  if (!searchState.showResults && searchState.result) searchState.showResults = true
  e.stopPropagation() // чтобы не закрывать открытые результаты
}

const emit = defineEmits(['resolved'])

const resolve = item => {
  emit('resolved', item)
  clearAll()
}
</script>

<template>
  <HelperPopupMenu
    v-model:open="searchState.showResults"
    class="w-full"
    contentClass="left-0 right-0">
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
        @keyup.enter="!props.cargoSearch && goTo(`/search/${searchState.query}`)"
        @click="onInputClick">
        <template
          v-if="searchState.query.length"
          #trailing>
          <UButton
            color="neutral"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            class="p-0"
            @click="searchState.query = ''" />
        </template>
      </UInput>
    </template>
    <template #content>
      <slot
        name="result"
        :searchState="searchState"
        :resolve="resolve" />
    </template>
  </HelperPopupMenu>
</template>
