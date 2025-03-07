<script setup>
const props = defineProps({
  filter: Object,
})

const emit = defineEmits(['filterChanged', 'resetFilter'])
const resetButtonDisabled = computed(() => props.filter.every(fGroup => fGroup.values.every(value => !value.active)))

const showFilterOnMobile = ref(false)
const toggleShowFilterOnMobile = () => {
  showFilterOnMobile.value = !showFilterOnMobile.value
}
</script>

<template>
  <div class="my-4 flex w-full flex-col rounded-xl px-2 -md:bg-gray-200">
    <UButton
      label="Подбор по параметрам"
      icon="i-heroicons-adjustments-vertical-solid"
      block
      @click="toggleShowFilterOnMobile"
      class="mx-auto my-4 w-64 md:hidden"
    >
      <template #trailing>
        <UIcon
          name="i-heroicons-chevron-down-solid"
          class="h-5 w-5 transition-transform duration-500"
          :class="{ 'rotate-over': showFilterOnMobile }"
        />
      </template>
    </UButton>
    <div
      class="expander expander-mobile-only"
      :class="{ open: showFilterOnMobile }"
    >
      <div class="">
        <CatalogFilterGroup
          v-for="(fGroup, index) in filter"
          :fGroup="fGroup"
          :index="index"
          @filterChanged="emit('filterChanged')"
        />
        <UButton
          label="Сбросить"
          icon="i-heroicons-arrow-path-rounded-square"
          :disabled="resetButtonDisabled"
          block
          @click="emit('resetFilter')"
          class="m-auto w-fit"
        />
        <UButton
          label="Свернуть"
          icon="i-heroicons-chevron-up-solid"
          variant="link"
          @click="toggleShowFilterOnMobile"
          class="float-right md:hidden"
        />
      </div>
    </div>
  </div>
</template>
