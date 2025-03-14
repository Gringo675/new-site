<script setup>
//
const { description, characteristics, documentation } = defineProps({
  description: String,
  characteristics: String,
  documentation: Object,
})

const infoBlock = []
infoBlock.push({ label: 'Описание', icon: 'i-heroicons-information-circle', html: description })
if (characteristics)
  infoBlock.push({ label: 'Характеристики', icon: 'i-heroicons-chart-bar-square', html: characteristics })
if (documentation) infoBlock.push({ label: 'Документация', icon: 'i-heroicons-document-text' })
infoBlock.push({
  label: 'Доставка',
  icon: 'i-material-symbols-delivery-truck-speed-outline-rounded',
  content: 'Здесь будет доставка',
})
</script>

<template>
  <div>
    <UTabs
      :items="infoBlock"
      :ui="{
        wrapper: 'my-4',
        list: {
          background: 'bg-amber-200 h-auto',
          tab: {
            base: '-sm:flex-wrap sm:py-2 -xs:px-1',
            icon: '-sm:w-full -sm:me-auto',
            height: 'h-auto',
            size: '-xs:text-xs',
          },
        },
        container: 'p-2 border border-amber-200 rounded-lg bg-rose-200',
      }"
    >
      <template #item="{ item }">
        <HelperDocsBlock
          v-if="item.label === 'Документация'"
          :docs="documentation"
        />
        <div
          v-if="item.html"
          v-html="item.html"
        ></div>
      </template>
    </UTabs>
  </div>
</template>
