<template>
  <HTabGroup
    :vertical="orientation === 'vertical'"
    :selected-index="selectedIndex"
    as="div"
    :class="ui.wrapper"
    v-bind="attrs"
    @change="onChange"
  >
    <div class="flex w-full items-end">
      <div class="relative flex-grow">
        <h1 class="font-accent mb-1 text-2xl">{{ catName }}</h1>
        <div
          class="absolute bottom-0 w-full border-4 border-r-8 border-t-8 border-orange-400 border-l-transparent border-t-transparent"
        ></div>
      </div>

      <HTabList
        ref="listRef"
        :class="[
          ui.list.base,
          ui.list.background,
          ui.list.rounded,
          ui.list.shadow,
          ui.list.padding,
          ui.list.width,
          orientation === 'horizontal' && ui.list.height,
          orientation === 'horizontal' && 'inline-grid items-center',
        ]"
        :style="[orientation === 'horizontal' && `grid-template-columns: repeat(${items.length}, minmax(0, 1fr))`]"
      >
        <div
          ref="markerRef"
          :class="ui.list.marker.wrapper"
        >
          <div
            :class="[ui.list.marker.base, ui.list.marker.background, ui.list.marker.rounded, ui.list.marker.shadow]"
          />
        </div>

        <HTab
          v-for="(item, index) of items"
          :key="index"
          ref="itemRefs"
          v-slot="{ selected, disabled }"
          :disabled="item.disabled"
          as="template"
        >
          <button
            :aria-label="item.ariaLabel"
            :class="[
              ui.list.tab.base,
              ui.list.tab.background,
              ui.list.tab.height,
              ui.list.tab.padding,
              ui.list.tab.size,
              ui.list.tab.font,
              ui.list.tab.rounded,
              ui.list.tab.shadow,
              selected ? ui.list.tab.active : ui.list.tab.inactive,
            ]"
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
                :class="ui.list.tab.icon"
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
      class="relative flex rounded-b-lg border-4 border-t-2 border-orange-400 bg-blue-400 transition-[height] duration-[1000ms]"
      :style="{ height: containerHeight }"
    >
      <div class="w-full overflow-hidden">
        <div
          class=""
          ref="content-block"
        >
          <HTabPanels
            v-if="content"
            :class="[ui.container]"
          >
            <HTabPanel
              v-for="(item, index) of items"
              :key="index"
              v-slot="{ selected }"
              :class="ui.base"
              :unmount="unmount"
            >
              <slot
                :name="item.slot || 'item'"
                :item="item"
                :index="index"
                :selected="selected"
              >
                {{ item.content }}
              </slot>
            </HTabPanel>
          </HTabPanels>
        </div>
      </div>

      <div class="absolute bottom-0 flex w-full justify-end bg-green-300/70">
        <UButton
          variant="link"
          :label="expand ? 'Свернуть' : 'Развернуть'"
          :icon="expand ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          @click="expand = !expand"
        />
      </div>
    </div>
  </HTabGroup>
</template>

<script>
import { toRef, ref, watch, onMounted, defineComponent, nextTick, computed, useTemplateRef } from 'vue'
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
import { useUI } from '#ui/composables/useUI'
import { mergeConfig } from '#ui/utils'
import appConfig from '#build/app.config'
import { tabs } from '#ui/ui.config'
import { useId } from '#imports'
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.tabs, tabs)
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
    modelValue: {
      type: Number,
      default: void 0,
    },
    catName: {
      type: String,
      default: '',
    },
    orientation: {
      type: String,
      default: 'horizontal',
      validator: value => ['horizontal', 'vertical'].includes(value),
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
    items: {
      type: Array,
      default: () => [],
    },
    unmount: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Boolean,
      default: true,
    },
    class: {
      type: [String, Object, Array],
      default: () => '',
    },
    ui: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('tabs', toRef(props, 'ui'), config, toRef(props, 'class'))
    const listRef = ref()
    const itemRefs = ref([])
    const markerRef = ref()
    const selectedIndex = ref(props.modelValue || props.defaultIndex)
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
      emit('change', index)
      if (props.modelValue !== void 0) {
        emit('update:modelValue', selectedIndex.value)
      }
      calcMarkerSize(selectedIndex.value)
      if (!expand.value) expand.value = true
      else calcContainerHeight()
    }
    useResizeObserver(listRef, () => {
      calcMarkerSize(selectedIndex.value)
    })
    watch(
      () => props.modelValue,
      value => {
        selectedIndex.value = value
        calcMarkerSize(selectedIndex.value)
      },
    )
    watch(
      () => props.items,
      async () => {
        await nextTick()
        calcMarkerSize(selectedIndex.value)
      },
      { deep: true },
    )
    onMounted(async () => {
      await nextTick()
      calcMarkerSize(selectedIndex.value)
    })
    provideUseId(() => useId())
    const expand = ref(false)
    const contentBlock = useTemplateRef('content-block')
    const containerHeight = ref('60px')
    const calcContainerHeight = async () => {
      await nextTick()
      containerHeight.value = expand.value ? `${contentBlock.value.scrollHeight + 50}px` : '60px'
    }
    watch(expand, calcContainerHeight)

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      listRef,
      itemRefs,
      markerRef,
      selectedIndex,
      onChange,
      expand,
      containerHeight,
    }
  },
})
</script>

<style>
.switcher-collapsed {
  /* position: absolute;
  bottom: 0;
  width: 100%; */
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.7) 100%);
}
</style>
