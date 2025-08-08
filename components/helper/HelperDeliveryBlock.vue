<script setup lang="ts">
const {
  data: cities,
  status,
  execute,
} = await useLazyFetch<
  {
    aString: string
    cityUID: string
  }[]
>('/api/dellin/getCities?q=мос', {
  immediate: false,
})

function onOpen() {
  if (!cities.value?.length) {
    execute()
  }
}
</script>

<template>
  <UInputMenu
    :items="cities"
    :loading="status === 'pending'"
    label-key="aString"
    :search-input="{ icon: 'i-lucide-search' }"
    placeholder="Select city"
    class="w-48"
    @update:open="onOpen">
    <!-- <template #leading="{ modelValue, ui }">
      <span
        v-if="modelValue"
        class="size-5 text-center">
        {{ modelValue?.emoji }}
      </span>
      <UIcon
        v-else
        name="i-lucide-earth"
        :class="ui.leadingIcon()" />
    </template>
    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ item.emoji }}
      </span>
    </template> -->
  </UInputMenu>
</template>
