<script setup>
// хелпер для поиска по каталогу и пункта доставки
defineExpose({
  clearAll,
})

const props = defineProps({
  forCatalog: {
    type: Boolean,
    default: false,
  },
  // forDelivery: {
  //   type: Boolean,
  //   default: false,
  // },
})

const options = {
  searchAPI: props.forCatalog ? '/api/getSearch?f=1&q=' : '/api/dellin/getCities?q=',
  placeHolder: props.forCatalog ? 'Поиск по каталогу' : 'Укажите пункт назначения',
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

function clearAll() {
  searchHelper.abortRequest()
  searchState.query = ''
  searchState.showResults = false
  searchState.result = null
}

const onInputClick = e => {
  if (!searchState.showResults && searchState.result) searchState.showResults = true
  e.stopPropagation() // чтобы не закрывать открытые результаты
}

const emit = defineEmits(['onEnter'])

// const resolve = () => {
//   clearAll()
//   // emit('resolved', item)
// }

const onEnter = async () => {
  if (props.forCatalog) emit('onEnter', searchState.query)
  else if (searchState.result?.length > 0) emit('onEnter', searchState.result[0])
}
</script>

<template>
  <HelperPopupMenu
    v-model:open="searchState.showResults"
    class=""
    contentClass="left-0 right-0">
    <template #trigger>
      <UInput
        v-model="searchState.query"
        color="primary"
        variant="outline"
        highlight
        :placeholder="options.placeHolder"
        leading-icon="i-heroicons-magnifying-glass-20-solid"
        :loading="searchState.pending"
        size="md"
        class="w-full"
        :class="props.forCatalog && 'z-21'"
        :ui="{
          base: props.forCatalog ? 'bg-violet-100 focus:bg-violet-50' : 'bg-gray-100 focus:bg-white',
        }"
        @keyup.enter="onEnter"
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
        :searchState="searchState" />
    </template>
  </HelperPopupMenu>
</template>
