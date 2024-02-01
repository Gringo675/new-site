<script setup>
const props = defineProps({
  pageProps: Object,
})
const emit = defineEmits(['turnPage', 'showMore'])

const pageProps = props.pageProps

const paginator = computed(() => {
  let paginator = []
  const activePage = pageProps.activePage + pageProps.showPages - 1
  for (let i = 0; i < pageProps.totalPages; i++) {
    paginator.push({
      val: i + 1,
      isActive: activePage - 1 === i,
    })
  }
  if (paginator.length > 7) {
    // нужно обрезать
    if (activePage < 5) {
      // обрезаем справа
      paginator.splice(5, paginator.length - 6, { isDecor: true })
    } else if (activePage > paginator.length - 4) {
      // образаем слева
      paginator.splice(1, paginator.length - 6, { isDecor: true })
    } else {
      // обрезаем с двух сторон
      paginator.splice(1, activePage - 3, { isDecor: true })
      paginator.splice(5, paginator.length - 6, { isDecor: true })
    }
  }
  return paginator
})

// emit turnPage: 1 = переход на бОльшую страницу, -1 = на меньшую
const handlePaginator = val => {
  if (val === 'prev') {
    pageProps.activePage = pageProps.activePage + pageProps.showPages - 2
    pageProps.showPages = 1
    emit('turnPage', {
      fromPagination: true,
      paginationToRight: false,
    })
  } else if (val === 'next') {
    pageProps.activePage = pageProps.activePage + pageProps.showPages
    pageProps.showPages = 1
    emit('turnPage', {
      fromPagination: true,
      paginationToRight: true,
    })
  } else if (val === 'more') {
    pageProps.showPages += 1
    emit('showMore', { fromShowMore: true })
    return
  } else if (val === '…') {
    return
  } else {
    if (val === pageProps.activePage + pageProps.showPages - 1) return // клик на активную страницу
    const paginationToRight = val > pageProps.activePage
    pageProps.activePage = val
    pageProps.showPages = 1
    emit('turnPage', {
      fromPagination: true,
      paginationToRight,
    })
  }
}
const hideShowMoreButton = computed(() => paginator.value[paginator.value.length - 1]?.isActive ?? true)
</script>

<template>
  <div
    v-show="pageProps.totalPages > 1"
    class="flex flex-col items-center my-2"
  >
    <div
      class="productsWrapperTransition m-2 p-2 bg-sky-100 rounded cursor-pointer hover:shadow hover:bg-sky-200"
      :class="{ 'opacity-0 scale-y-0': hideShowMoreButton }"
      @click="handlePaginator('more')"
    >
      Показать еще
    </div>
    <div class="flex justify-center items-end space-x-2">
      <UTooltip
        v-if="paginator.length > 1 && !paginator[0].isActive"
        text="Предыдущая"
      >
        <UButton
          icon="i-heroicons-arrow-small-left-20-solid"
          color="secondary"
          :ui="{ rounded: 'rounded-full' }"
          @click="handlePaginator('prev')"
        />
      </UTooltip>
      <template v-for="link in paginator">
        <div v-if="link.isDecor">…</div>
        <UButton
          v-else
          :label="link.val.toString()"
          :variant="link.isActive ? 'solid' : 'outline'"
          class="min-w-10 justify-center"
          color="secondary"
          @click="handlePaginator(link.val)"
        />
      </template>
      <UTooltip
        v-if="paginator.length > 1 && !paginator[paginator.length - 1].isActive"
        text="Следующая"
      >
        <UButton
          icon="i-heroicons-arrow-small-right-20-solid"
          color="secondary"
          :ui="{ rounded: 'rounded-full' }"
          @click="handlePaginator('next')"
        />
      </UTooltip>
    </div>
  </div>
</template>
