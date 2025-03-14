<script setup>
const screen = useScreen()

const items = [
  {
    label: 'Описание',
    icon: 'i-heroicons-information-circle',
    content: 'This is the content shown for Tab1',
  },
  {
    label: 'Характеристики',
    icon: 'i-heroicons-arrow-down-tray',
    content: 'And, this is the content for Tab2',
  },
  {
    label: 'Документация',
    icon: 'i-heroicons-eye-dropper',
    content: 'Finally, this is the content for Tab3',
  },
  {
    label: 'Доставка',
    icon: 'i-heroicons-eye-dropper',
    content: 'Finally, this is the content for Tab3',
  },
]
</script>

<template>
  <div class="m-4 bg-green-200">
    <UTabs :items="items">
      <template #item="{ item }">
        <div
          v-if="item.label === 'Документация'"
          class=""
        >
          {{ item.label }}
        </div>
      </template>
    </UTabs>
    <!-- <UTabs
      v-if="!screen.isMobile"
      :items="items"
    />
    <UAccordion
      v-else
      :items="items"
    /> -->
  </div>
</template>
