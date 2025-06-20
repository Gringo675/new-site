<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TabsRootProps, TabsRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tabs'
import { tv } from '#ui/utils/tv'
import type { AvatarProps } from '#ui/types'
import type { DynamicSlots, PartialString } from '#ui/types/utils'

const appConfigTabs = _appConfig as AppConfig & { ui: { tabs: Partial<typeof theme> } }

const tabs = tv({ extend: tv(theme), ...(appConfigTabs.ui?.tabs || {}) })

export interface TabsItem {
  label?: string
  icon?: string
  avatar?: AvatarProps
  slot?: string
  content?: string
  value?: string | number
  disabled?: boolean
  [key: string]: any
}

type TabsVariants = VariantProps<typeof tabs>

export interface TabsProps<T extends TabsItem = TabsItem>
  extends Pick<TabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode' | 'unmountOnHide'> {
  as?: any
  items?: T[]
  title?: string
  documentation?: object
  color?: TabsVariants['color']
  variant?: TabsVariants['variant']
  size?: TabsVariants['size']
  orientation?: TabsRootProps['orientation']
  content?: boolean
  labelKey?: string
  class?: any
  ui?: PartialString<typeof tabs.slots>
}

export interface TabsEmits extends TabsRootEmits<string | number> {}

type SlotProps<T extends TabsItem> = (props: { item: T; index: number }) => any

export type TabsSlots<T extends TabsItem = TabsItem> = {
  leading: SlotProps<T>
  default: SlotProps<T>
  trailing: SlotProps<T>
  content: SlotProps<T>
} & DynamicSlots<T, undefined, { index: number }>
</script>

<script setup lang="ts" generic="T extends TabsItem">
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import UIcon from '#ui/components/Icon.vue'

const props = defineProps({
  title: String,
  description: String,
  characteristics: String,
  documentation: {
    type: Object,
    default: () => ({}),
  },
  showDelivery: Boolean,
  content: {
    type: Boolean,
    default: true,
  },
  modelValue: String,
  defaultValue: {
    type: String,
    default: '0',
  },
  orientation: {
    type: String as () => 'horizontal' | 'vertical',
    default: 'horizontal',
  },
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  labelKey: {
    type: String,
    default: 'label',
  },
})

const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<T>>()

const rootProps = useForwardPropsEmits(
  reactivePick(props, 'modelValue', 'defaultValue', 'orientation', 'unmountOnHide'),
  emits,
)

const items = []
if (props.description)
  items.push({
    label: 'Описание',
    icon: 'i-heroicons-information-circle',
    content: 'Описание',
    html: props.description,
  })
if (props.characteristics)
  items.push({
    label: 'Характеристики',
    icon: 'i-heroicons-chart-bar-square',
    content: 'Характеристики',
    html: `<div class="characteristics">${props.characteristics}</div>`,
  })
if (Object.keys(props.documentation).length > 0)
  items.push({ label: 'Документация', icon: 'i-heroicons-document-text', content: 'Документация' })
if (props.showDelivery)
  items.push({
    label: 'Способы получения',
    icon: 'i-heroicons-truck',
    content: 'Способы получения',
  })

const contentRef = useTemplateRef('contentRef')
const contentHeight = ref(0)
const expand = ref(false)
const containerHeight = computed(() => (expand.value ? `${contentHeight.value + 70}px` : '80px'))
let observer = null
onMounted(() => {
  observer = new ResizeObserver(entries => {
    contentHeight.value = entries[0].contentRect.height
  })
  observer.observe(contentRef.value)
})
onUnmounted(() => {
  observer.disconnect()
})
</script>

<template>
  <TabsRoot
    class="my-4"
    v-bind="rootProps"
    @update:modelValue="expand = true"
  >
    <div class="flex w-full items-end max-lg:flex-wrap">
      <div
        v-if="title"
        class="flex grow items-center self-stretch pr-2 pb-3 max-lg:py-4"
      >
        <h1 class="font-accent text-2xl leading-7 max-xl:text-xl max-xl:leading-6">{{ title }}</h1>
      </div>
      <TabsList
        class="relative flex rounded-t-lg bg-stone-800 p-1 pb-2 max-lg:w-full"
        :class="title ? 'w-max' : 'w-full'"
      >
        <TabsIndicator
          class="TabsIndicator absolute top-1 bottom-2 left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-md bg-(--ui-primary) transition-[translate,width] duration-400"
        />

        <TabsTrigger
          v-for="(item, index) of items"
          :key="index"
          :value="item.value || String(index)"
          class="relative inline-flex w-full flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary) data-[state=active]:text-white data-[state=inactive]:text-orange-200 hover:data-[state=inactive]:cursor-pointer hover:data-[state=inactive]:text-orange-100 max-lg:min-w-0 max-sm:flex-wrap sm:px-3 sm:py-2"
        >
          <slot
            name="leading"
            :item="item"
            :index="index"
          >
            <UIcon
              v-if="item.icon"
              :name="item.icon"
              class="UIconTabs size-4 shrink-0 max-sm:w-full"
            />
          </slot>

          <span class="truncate">
            {{ item.label }}
          </span>
        </TabsTrigger>
      </TabsList>
    </div>

    <div
      class="relative -mt-2 w-full overflow-hidden rounded-lg border-4 border-stone-800 bg-gray-50 p-2 transition-[height] duration-400"
      :style="{ height: containerHeight }"
    >
      <div
        class=""
        ref="contentRef"
      >
        <TabsContent
          v-for="(item, index) of items"
          :key="index"
          :value="item.value || String(index)"
          class=""
        >
          <div
            v-if="item.html"
            v-html="item.html"
          ></div>
          <HelperDocsBlock
            v-else-if="item.label === 'Документация'"
            :docs="documentation"
          />
          <HelperDeliveryBlock v-else-if="item.label === 'Способы получения'" />
          <div v-else>{{ item.content }}</div>
        </TabsContent>
      </div>

      <div class="from-muted absolute inset-x-0 bottom-0 flex h-12 items-center justify-end bg-gradient-to-t">
        <UButton
          color="primary"
          :label="expand ? 'Свернуть' : 'Развернуть'"
          :icon="expand ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          block
          class="mx-10 w-32"
          @click="expand = !expand"
        />
      </div>
    </div>
  </TabsRoot>
</template>
