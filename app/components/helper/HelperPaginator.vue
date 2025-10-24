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
const showMoreButton = computed(() => {
  const lastPage = paginator.value[paginator.value.length - 1]
  return lastPage && !lastPage.isActive
})
</script>

<template>
  <div
    v-show="pageProps.totalPages > 1"
    class="my-4 flex flex-col items-center">
    <UButton
      v-if="showMoreButton"
      label="Показать еще"
      variant="subtle"
      color="tertiary"
      size="lg"
      class="px-6"
      @click="handlePaginator('more')" />
    <div class="mt-4 flex items-end justify-center gap-2">
      <UButton
        v-if="paginator.length > 1 && !paginator[0].isActive"
        icon="i-heroicons-arrow-small-left-20-solid"
        color="tertiary"
        variant="outline"
        class="max-xs:p-1 rounded-full"
        @click="handlePaginator('prev')"
        aria-label="Предыдущая" />
      <template v-for="link in paginator">
        <div v-if="link.isDecor">…</div>
        <UButton
          v-else
          :label="link.val.toString()"
          :variant="link.isActive ? 'solid' : 'outline'"
          class="max-xs:p-1 max-xs:min-w-7 min-w-10 justify-center"
          color="tertiary"
          @click="handlePaginator(link.val)" />
      </template>
      <UButton
        v-if="paginator.length > 1 && !paginator[paginator.length - 1].isActive"
        icon="i-heroicons-arrow-small-right-20-solid"
        color="tertiary"
        variant="outline"
        class="max-xs:p-1 rounded-full"
        @click="handlePaginator('next')"
        aria-label="Следующая" />
    </div>
  </div>
</template>
