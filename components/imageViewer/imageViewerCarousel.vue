<template>
  <div class="flex h-full w-full flex-col select-none">
    <div class="relative grow overflow-hidden">
      <div
        ref="carouselRef"
        class="flex h-full overflow-hidden"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex flex-none basis-full justify-center p-2"
          :class="[fullScreen && 'items-center']"
          :role="items.length > 1 ? 'tabpanel' : null"
        >
          <slot
            :item="item"
            :index="index"
          />
        </div>
      </div>
      <template
        v-if="items.length > 1"
        class=""
      >
        <button
          type="button"
          :disabled="isFirst"
          @click.stop="onClickPrev"
          class="group absolute top-1/2 flex -translate-y-1/2 rounded-full bg-violet-100 p-2 text-violet-400 opacity-60 hover:opacity-90 focus:outline-none focus-visible:outline-none disabled:opacity-20"
          :class="[fullScreen ? 'left-3' : 'left-1']"
        >
          <UIcon
            name="i-heroicons-chevron-left"
            class="size-8 transition-transform group-hover:group-not-disabled:-translate-x-2"
          />
        </button>
        <button
          type="button"
          :disabled="isLast"
          @click.stop="onClickNext"
          class="group absolute top-1/2 flex -translate-y-1/2 rounded-full bg-violet-100 p-2 text-violet-400 opacity-60 hover:opacity-90 focus:outline-none focus-visible:outline-none disabled:opacity-20"
          :class="[fullScreen ? 'right-3' : 'right-1']"
        >
          <UIcon
            name="i-heroicons-chevron-right"
            class="size-8 transition-transform group-hover:group-not-disabled:translate-x-2"
          />
        </button>
      </template>
    </div>

    <div
      v-if="items.length > 1"
      role="tablist"
      class="flex items-center justify-center gap-3 overflow-auto p-2"
      :class="[fullScreen && 'max-xs:hidden max-h-[20vh] min-h-15']"
    >
      <template
        v-for="page in pages"
        :key="page"
      >
        <img
          @click.stop="onClick(page)"
          :src="items[page - 1].thumb ?? items[page - 1]"
          class="max-h-full max-w-25 min-w-5 rounded"
          :class="[page === currentPage ? 'cursor-default ring-3 ring-violet-400 brightness-85' : 'cursor-pointer']"
          draggable="false"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useScroll, useResizeObserver } from '@vueuse/core'

export default defineComponent({
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const carouselRef = ref()
    const itemWidth = ref(0)
    const { x } = useScroll(carouselRef, { behavior: 'smooth' })
    useCarouselScroll(carouselRef, centerCurrentPage)
    useResizeObserver(carouselRef, entries => {
      const currPage = itemWidth.value > 0 ? currentPage.value : 0
      const [entry] = entries
      itemWidth.value = entry?.target?.firstElementChild?.clientWidth || 0
      if (currPage > 0) onClick(currPage) // centering
    })
    const currentPage = computed(() => {
      if (!itemWidth.value) {
        return 0
      }
      return Math.round(x.value / itemWidth.value) + 1
    })
    const pages = props.items.length
    const isFirst = computed(() => currentPage.value <= 1)
    const isLast = computed(() => currentPage.value === pages)
    function onClickNext() {
      x.value += itemWidth.value
    }
    function onClickPrev() {
      x.value -= itemWidth.value
    }
    function onClick(page) {
      x.value = (page - 1) * itemWidth.value
    }
    function centerCurrentPage() {
      onClick(currentPage.value)
    }
    expose({
      pages,
      page: currentPage,
      prev: onClickPrev,
      next: onClickNext,
      select: onClick,
      container: carouselRef,
    })
    return {
      isFirst,
      isLast,
      carouselRef,
      pages,
      currentPage,
      onClickNext,
      onClickPrev,
      onClick,
    }
  },
})
</script>

<!-- <style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> -->
