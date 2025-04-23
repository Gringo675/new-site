<template>
  <div class="carouseWrapper flex h-full w-full flex-col select-none">
    <div class="imagesWrapper relative grow overflow-hidden">
      <div
        ref="carouselRef"
        class="imagesRibbon flex h-full overflow-hidden bg-violet-200"
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
          class="group absolute top-1/2 flex -translate-y-1/2 rounded-full bg-slate-200 p-2 text-slate-600 opacity-60 hover:opacity-90 focus:outline-none focus-visible:outline-none disabled:opacity-20"
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
          class="group absolute top-1/2 flex -translate-y-1/2 rounded-full bg-slate-200 p-2 text-slate-600 opacity-60 hover:opacity-90 focus:outline-none focus-visible:outline-none disabled:opacity-20"
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
      class="flex items-center justify-center gap-3 overflow-auto bg-green-200 p-2"
      :class="[fullScreen && 'max-xs:hidden max-h-[20vh] min-h-15']"
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

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
