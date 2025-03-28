<template>
  <HTabGroup
    :selected-index="selectedIndex"
    as="div"
    class="relative my-4"
    @change="onChange"
  >
    <div class="flex w-full items-end -md:flex-wrap">
      <div class="relative flex flex-grow items-center self-stretch pb-1 pr-2 -md:py-4">
        <h1 class="font-accent text-2xl leading-7 -xl:text-xl -xl:leading-6">{{ catName }}</h1>
        <div
          class="absolute bottom-0 w-full border-b-4 border-l-2 border-r-8 border-t-[34px] border-cyan-300 border-l-transparent border-t-transparent -md:hidden"
        ></div>
      </div>

      <HTabList
        ref="listRef"
        class="relative inline-grid h-auto w-max items-center rounded-none rounded-t-lg bg-cyan-300 p-1 -md:w-full"
        :style="`grid-template-columns: repeat(${items.length}, minmax(0, 1fr))`"
      >
        <div
          ref="markerRef"
          class="absolute left-[4px] top-[4px] duration-200 ease-out focus:outline-none"
        >
          <div class="h-full w-full rounded-md bg-cyan-50 shadow-sm" />
        </div>

        <HTab
          v-for="(item, index) of items"
          :key="index"
          ref="itemRefs"
          v-slot="{ selected, disabled }"
          as="template"
        >
          <button
            class="ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 ui-not-focus-visible:outline-none relative inline-flex h-auto w-full flex-shrink-0 items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors duration-200 ease-out focus:outline-none sm:py-2 -sm:flex-wrap -xs:px-1 -xs:text-xs"
            :class="[selected ? 'text-gray-900' : 'text-gray-600']"
          >
            <slot
              name="icon"
              :item="item"
              :index="index"
              :selected="selected"
              :disabled="disabled"
            >
              <UIcon
                v-if="item.icon"
                :name="item.icon"
                class="me-2 -sm:me-auto -sm:w-full"
              />
            </slot>

            <slot
              :item="item"
              :index="index"
              :selected="selected"
              :disabled="disabled"
            >
              <span class="truncate">{{ item.label }}</span>
            </slot>
          </button>
        </HTab>
      </HTabList>
    </div>

    <div
      class="relative overflow-hidden rounded-b-lg border-4 border-t-2 border-cyan-300 bg-cyan-300 transition-[height] duration-[500ms]"
      :style="{ height: containerHeight }"
    >
      <HTabPanels
        ref="contentRef"
        class="rounded-lg bg-gray-50 p-2"
      >
        <HTabPanel
          v-for="(item, index) of items"
          :key="index"
          class="focus:outline-none"
        >
          <div
            v-if="item.html"
            v-html="item.html"
          ></div>
          <HelperDocsBlock
            v-else-if="item.label === 'Документация'"
            :docs="documentation"
          />
          <div v-else>{{ item.content }}</div>
        </HTabPanel>
      </HTabPanels>

      <div class="absolute bottom-0 flex w-full justify-end bg-gradient-to-b from-cyan-300/0 to-cyan-300/90">
        <UButton
          color="blue"
          :label="expand ? 'Свернуть' : 'Развернуть'"
          :icon="expand ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          block
          class="mx-4 my-2 w-32"
          @click="expand = !expand"
        />
      </div>
    </div>
  </HTabGroup>
</template>

<script>
// created from @nuxt\ui\dist\runtime\components\navigation\Tabs.vue
import { ref, watch, onMounted, defineComponent, nextTick } from 'vue'
import {
  TabGroup as HTabGroup,
  TabList as HTabList,
  Tab as HTab,
  TabPanels as HTabPanels,
  TabPanel as HTabPanel,
  provideUseId,
} from '@headlessui/vue'
import { useResizeObserver } from '@vueuse/core'
import UIcon from '#ui/components/elements/Icon.vue'
import { useId } from '#imports'
export default defineComponent({
  components: {
    UIcon,
    HTabGroup,
    HTabList,
    HTab,
    HTabPanels,
    HTabPanel,
  },
  inheritAttrs: false,
  props: {
    catName: String,
    image: String,
    description: String,
    characteristics: String,
    documentation: Object,
  },
  setup(props) {
    const listRef = ref()
    const itemRefs = ref([])
    const markerRef = ref()
    const contentRef = ref()
    const selectedIndex = ref(0)
    function calcMarkerSize(index) {
      const tab = itemRefs.value[index]?.$el
      if (!tab) {
        return
      }
      if (!markerRef.value) {
        return
      }
      markerRef.value.style.top = `${tab.offsetTop}px`
      markerRef.value.style.left = `${tab.offsetLeft}px`
      markerRef.value.style.width = `${tab.offsetWidth}px`
      markerRef.value.style.height = `${tab.offsetHeight}px`
    }
    function onChange(index) {
      selectedIndex.value = index
      calcMarkerSize(selectedIndex.value)
      if (!expand.value) expand.value = true
      else calcContainerHeight()
    }
    useResizeObserver(listRef, () => {
      calcMarkerSize(selectedIndex.value)
    })

    onMounted(async () => {
      await nextTick()
      calcMarkerSize(selectedIndex.value)
    })
    provideUseId(() => useId())

    const catImagesDirectory = useRuntimeConfig().public.IMAGES_DIRECTORY + 'img_categories/'
    const items = []
    if (props.description)
      items.push({
        label: 'Описание',
        icon: 'i-heroicons-information-circle',
        html: props.image.length
          ? `
        <div class="float-left flex w-[120px] items-center justify-center mb-1 mr-3 -xs:w-20">
          <img
          src="${catImagesDirectory + props.image}"
          class="h-auto w-auto max-w-full"
          />
        </div>
        <div>${props.description}</div>
        <div class="clear-both"></div>
        `
          : props.description,
      })
    if (props.characteristics)
      items.push({
        label: 'Характеристики',
        icon: 'i-heroicons-chart-bar-square',
        html: `<div class="characteristics">${props.characteristics}</div>`,
      })
    if (props.documentation) items.push({ label: 'Документация', icon: 'i-heroicons-document-text' })

    const expand = ref(false)
    const containerHeight = ref('75px')
    const calcContainerHeight = async () => {
      await nextTick()
      containerHeight.value = expand.value ? `${contentRef.value.$el.scrollHeight + 54}px` : '75px'
    }
    watch(expand, calcContainerHeight)
    return {
      listRef,
      itemRefs,
      markerRef,
      contentRef,
      selectedIndex,
      onChange,
      items,
      expand,
      containerHeight,
    }
  },
})
</script>
