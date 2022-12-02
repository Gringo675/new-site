<script setup>

const props = defineProps({
  filter: Object,
  filterInitial: Array
})
const filter = props.filter

const resetFilter = () => {
  filter.forEach(fGroup => {
    fGroup.values.forEach(prop => {
      if (props.filterInitial.includes(prop.val)) {
        prop.active = true
      } else {
        prop.active = false
      }
    })
  })
}

</script>

<template>
  <div class="w-[250px] p-2 bg-orange-50 rounded-xl">
    <template v-for="fGroup in filter">
      <CatalogFilterGroup :fGroup="fGroup"/>
    </template>
    <button class="m-auto block py-2 px-3 bg-purple-200 rounded cursor-pointer hover:shadow hover:bg-purple-300 transition-colors"
            @click="resetFilter"
    >
      Сбросить
    </button>
  </div>
</template>

<style>

</style>