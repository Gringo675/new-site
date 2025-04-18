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
  <div class="mt-10 mb-4 flex w-full flex-col rounded-xl px-2 max-md:mt-0 max-md:bg-gray-200">
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
        <div class="flex justify-center">
          <UButton
            label="Сбросить"
            icon="i-heroicons-arrow-path-rounded-square"
            :disabled="resetButtonDisabled"
            block
            @click="emit('resetFilter')"
            class="mx-auto max-w-60"
          />
        </div>

        <!-- ask question -->
        <div
          class="@container my-4 grid grid-cols-[min-content_auto_auto] items-center gap-2 rounded-xl border border-rose-200 bg-rose-100 p-2"
        >
          <UIcon
            name="i-heroicons-chat-bubble-oval-left-ellipsis"
            class="col-span-1 row-span-1 h-full w-6 text-cyan-600 @[16.5rem]:row-span-2 @[16.5rem]:w-16 @md:row-span-1 @md:w-11"
          />

          <div class="col-span-2 ml-auto text-cyan-600 italic @[16.5rem]:text-lg @md:col-span-1 @md:mx-auto">
            Нужна консультация?
          </div>
          <UButton
            label="Спросить у технолога"
            variant="outline"
            size="lg"
            block
            class="col-span-3 text-base @[16.5rem]:col-span-2 @md:col-span-1"
          />
        </div>

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
