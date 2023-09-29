<script setup>
const props = defineProps({
  filter: Object,
})

const emit = defineEmits(['filterChanged', 'resetFilter'])
const resetButtonDisabled = computed(() => props.filter.every(fGroup => fGroup.values.every(value => !value.active)))
</script>

<template>
  <div class="w-[250px] p-2 bg-orange-50 rounded-xl">
    <template v-for="(fGroup, index) in filter">
      <CatalogFilterGroup
        :fGroup="fGroup"
        :index="index"
        @filterChanged="emit('filterChanged')"
      />
    </template>
    <button
      class="m-auto block py-2 px-3 bg-purple-200 rounded hover:shadow hover:bg-purple-300 transition-colors"
      :disabled="resetButtonDisabled"
      @click="emit('resetFilter')"
    >
      Сбросить
    </button>
  </div>
</template>
