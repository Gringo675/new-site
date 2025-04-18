<template>
  <div
    class="relative select-none"
    :class="[fullScreen ? 'flex h-screen w-screen flex-col' : 'p-2']"
  >
    <div
      ref="carouselRef"
      class="no-scrollbar relative flex w-full snap-none snap-mandatory overflow-x-auto scroll-smooth"
      :class="[fullScreen && 'flex-1 items-center']"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex flex-none basis-full snap-center justify-center p-2"
        :class="[fullScreen && 'h-full snap-always']"
        :role="indicators ? 'tabpanel' : null"
      >
        <slot
          :item="item"
          :index="index"
        />
      </div>
    </div>

    <div
      v-if="arrows"
      class=""
    >
      <slot
        name="prev"
        :on-click="onClickPrev"
        :disabled="isFirst"
      />

      <slot
        name="next"
        :on-click="onClickNext"
        :disabled="isLast"
      />
    </div>

    <div
      v-if="indicators"
      role="tablist"
      class="relative inset-x-0 bottom-0 flex items-stretch justify-center gap-3 bg-green-200"
      :class="[fullScreen ? 'max-h-[20vh] p-2 max-sm:hidden' : 'mt-4 overflow-auto']"
    >
      <template
        v-for="page in pages"
        :key="page"
      >
        <slot
          name="indicator"
          :on-click="onClick"
          :active="page === currentPage"
          :page="page"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useScroll, useResizeObserver, useElementSize } from '@vueuse/core'

export default defineComponent({
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    arrows: {
      type: Boolean,
      default: false,
    },
    indicators: {
      type: Boolean,
      default: false,
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
    const { width: carouselWidth } = useElementSize(carouselRef)
    useCarouselScroll(carouselRef)
    useResizeObserver(carouselRef, entries => {
      const [entry] = entries
      itemWidth.value = entry?.target?.firstElementChild?.clientWidth || 0
    })
    const currentPage = computed(() => {
      if (!itemWidth.value) {
        return 0
      }
      return Math.round(x.value / itemWidth.value) + 1
    })
    const pages = computed(() => {
      if (!itemWidth.value) {
        return 0
      }
      const itemDivisions = Math.round(carouselWidth.value / itemWidth.value)
      if (props.items.length <= itemDivisions) {
        return 0
      }
      return props.items.length - itemDivisions + 1
    })
    const isFirst = computed(() => currentPage.value <= 1)
    const isLast = computed(() => currentPage.value === pages.value)
    function onClickNext() {
      x.value += itemWidth.value
    }
    function onClickPrev() {
      x.value -= itemWidth.value
    }
    function onClick(page) {
      x.value = (page - 1) * itemWidth.value
    }
    expose({
      pages,
      page: currentPage,
      prev: onClickPrev,
      next: onClickNext,
      select: onClick,
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
