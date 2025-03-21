<script setup>
//
const { catName, description, characteristics, documentation } = defineProps({
  catName: String,
  description: String,
  characteristics: String,
  documentation: Object,
})

const infoBlock = []
infoBlock.push({ label: 'Описание', icon: 'i-heroicons-information-circle', html: description })
if (characteristics)
  infoBlock.push({ label: 'Характеристики', icon: 'i-heroicons-chart-bar-square', html: characteristics })
if (documentation) infoBlock.push({ label: 'Документация', icon: 'i-heroicons-document-text' })
// infoBlock.push({
//   label: 'Доставка',
//   icon: 'i-material-symbols-delivery-truck-speed-outline-rounded',
//   content: 'Здесь будет доставка',
// })
</script>

<template>
  <div>
    <TestTabs
      :items="infoBlock"
      :catName="catName"
      :ui="{
        wrapper: 'wrapper my-4 space-y-0',
        container: 'tabsContainer p-2  bg-rose-200',
        base: 'tabsBase',
        list: {
          background: 'bg-orange-400',
          rounded: 'rounded-none rounded-t-lg',
          height: 'h-auto',
          width: 'w-max',
          tab: {
            base: '-sm:flex-wrap sm:py-2 -xs:px-1',
            icon: '-sm:w-full -sm:me-auto',
            height: 'h-auto',
            size: '-xs:text-xs',
          },
        },
      }"
    >
      <template #item="{ item }">
        <HelperDocsBlock
          v-if="item.label === 'Документация'"
          :docs="documentation"
        />
        <div
          v-else-if="item.html"
          v-html="item.html"
        ></div>
      </template>
    </TestTabs>
  </div>
</template>
