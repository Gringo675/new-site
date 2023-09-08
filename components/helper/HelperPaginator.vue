<script setup>
const props = defineProps({
  pageProps: Object,
})
const emit = defineEmits(['turnPage'])

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
      paginator.splice(5, paginator.length - 6, { val: '…', isDecor: true })
    } else if (activePage > paginator.length - 4) {
      // образаем слева
      paginator.splice(1, paginator.length - 6, { val: '…', isDecor: true })
    } else {
      // обрезаем с двух сторон
      paginator.splice(1, activePage - 3, { val: '…', isDecor: true })
      paginator.splice(5, paginator.length - 6, { val: '…', isDecor: true })
    }
  }
  return paginator
})

// emit turnPage: 1 = переход на бОльшую страницу, -1 = на меньшую
const handlePaginator = val => {
  if (val === 'prev') {
    pageProps.activePage = pageProps.activePage + pageProps.showPages - 2
    pageProps.showPages = 1
    emit('turnPage', -1)
  } else if (val === 'next') {
    pageProps.activePage = pageProps.activePage + pageProps.showPages
    pageProps.showPages = 1
    emit('turnPage', 1)
  } else if (val === 'more') {
    pageProps.showPages += 1
    return
  } else if (val === '…') {
    return
  } else {
    const direction = val > pageProps.activePage ? 1 : -1
    pageProps.activePage = val
    pageProps.showPages = 1
    emit('turnPage', direction)
  }
}

// watch(
//   () => pageProps.activePage,
//   (value, oldValue) => emit('turnPage', value > oldValue ? 1 : -1)
// )
</script>

<template>
  <div
    v-show="pageProps.totalPages > 1"
    class="flex flex-col items-center my-2"
  >
    <div
      v-if="paginator.length > 1 && !paginator[paginator.length - 1].isActive"
      class="m-2 p-2 bg-sky-100 rounded cursor-pointer hover:shadow hover:bg-sky-200"
      @click="handlePaginator('more')"
    >
      Показать еще
    </div>
    <div class="flex justify-center items-end">
      <div
        v-if="paginator.length > 1 && !paginator[0].isActive"
        class="m-1 px-1 cursor-pointer rounded hover:shadow hover:bg-sky-200"
        @click="handlePaginator('prev')"
      >
        ⇦
      </div>
      <div
        v-for="link in paginator"
        class="h-6 text-center"
        :class="{
          'm-1 w-7 rounded ': !link.isDecor,
          'bg-sky-100 cursor-pointer hover:shadow hover:bg-sky-200': link.isActive === false,
          'bg-sky-300 cursor-default': link.isActive,
          'cursor-default text-sm': link.isDecor,
        }"
        @click="handlePaginator(link.val)"
      >
        {{ link.val }}
      </div>
      <div
        v-if="paginator.length > 1 && !paginator[paginator.length - 1].isActive"
        class="m-1 px-1 cursor-pointer rounded hover:shadow hover:bg-sky-200"
        @click="handlePaginator('next')"
      >
        ⇨
      </div>
    </div>
  </div>
</template>
