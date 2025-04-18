<!-- eslint-disable vue/block-tag-newline -->
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
  /**
   * @IconifyIcon
   */
  icon?: string
  avatar?: AvatarProps
  slot?: string
  content?: string
  /** A unique value for the tab item. Defaults to the index. */
  value?: string | number
  disabled?: boolean
  [key: string]: any
}

type TabsVariants = VariantProps<typeof tabs>

export interface TabsProps<T extends TabsItem = TabsItem>
  extends Pick<TabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * @defaultValue ''
   */
  title?: string
  /**
   * @defaultValue {}
   */
  documentation?: object
  /**
   * @defaultValue 'primary'
   */
  color?: TabsVariants['color']
  /**
   * @defaultValue 'pill'
   */
  variant?: TabsVariants['variant']
  /**
   * @defaultValue 'md'
   */
  size?: TabsVariants['size']
  /**
   * The orientation of the tabs.
   * @defaultValue 'horizontal'
   */
  orientation?: TabsRootProps['orientation']
  /**
   * The content of the tabs, can be disabled to prevent rendering the content.
   * @defaultValue true
   */
  content?: boolean
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
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

const props = withDefaults(defineProps<TabsProps<T>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal',
  unmountOnHide: true,
  labelKey: 'label',
  title: '',
  documentation: () => ({}),
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<T>>()

const rootProps = useForwardPropsEmits(
  reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'activationMode', 'unmountOnHide'),
  emits,
)

const contentRef = useTemplateRef('contentRef')
function onTabChange() {
  if (!expand.value) expand.value = true
  else calcContainerHeight()
}
const expand = ref(false)
const containerHeight = ref('75px')
const calcContainerHeight = async () => {
  if (expand.value) {
    await new Promise(resolve => setTimeout(resolve, 100))
    containerHeight.value = `${contentRef.value.scrollHeight + 54}px`
  } else containerHeight.value = '75px'
}
watch(expand, calcContainerHeight)
</script>

<template>
  <TabsRoot
    class="my-4"
    v-bind="rootProps"
    @update:modelValue="onTabChange"
  >
    <div class="flex w-full items-end max-lg:flex-wrap">
      <div
        v-if="title"
        class="relative flex grow items-center self-stretch pr-2 pb-1 max-lg:py-4"
      >
        <h1 class="font-accent text-2xl leading-7 max-xl:text-xl max-xl:leading-6">{{ title }}</h1>
        <div
          class="absolute bottom-0 w-full border-t-[34px] border-r-8 border-b-4 border-l-2 border-cyan-300 border-t-transparent border-l-transparent max-lg:hidden"
        ></div>
      </div>
      <TabsList
        class="relative flex rounded-t-[var(--ui-radius)] bg-cyan-300 p-1 max-lg:w-full"
        :class="title ? 'w-max' : 'w-full'"
      >
        <TabsIndicator
          class="absolute inset-y-1 left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-[calc(var(--ui-radius)*1.5)] bg-(--ui-primary) shadow-xs transition-[translate,width] duration-200"
        />

        <TabsTrigger
          v-for="(item, index) of items"
          :key="index"
          :value="item.value || String(index)"
          :disabled="item.disabled"
          class="relative inline-flex w-full flex-1 items-center justify-center gap-1.5 rounded-[calc(var(--ui-radius)*1.5)] px-2 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary) disabled:cursor-not-allowed disabled:opacity-75 data-[state=active]:text-(--ui-bg) data-[state=inactive]:text-(--ui-text-muted) hover:data-[state=inactive]:not-disabled:text-(--ui-text) max-lg:min-w-0 max-sm:flex-wrap sm:px-3 sm:py-2"
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
      class="relative w-full overflow-hidden rounded-b-[var(--ui-radius)] border-4 border-t-2 border-cyan-300 bg-cyan-300 transition-[height] duration-[500ms]"
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
          class="rounded-[var(--ui-radius)] bg-gray-50 p-2"
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

      <div class="absolute bottom-0 flex w-full justify-end bg-linear-to-b from-cyan-300/0 to-cyan-300/90">
        <UButton
          color="neutral"
          :label="expand ? 'Свернуть' : 'Развернуть'"
          :icon="expand ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          block
          class="mx-4 my-2 w-32"
          @click="expand = !expand"
        />
      </div>
    </div>
  </TabsRoot>
</template>
