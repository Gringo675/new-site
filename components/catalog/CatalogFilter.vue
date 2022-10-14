<script setup>
import CatalogFilterGroup from "./CatalogFilterGroup";

const props = defineProps({
  filter: Object,
  initialFilterProps: Set
})
const filter = props.filter

const resetFilter = () => {
  filter.forEach(fGroup => {
    fGroup.values.forEach(prop => {
      if (props.initialFilterProps.has(prop.val)) {
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
      <CatalogFilterGroup :fGroup="fGroup" />
<!--      {{ fGroup.name }}-->
<!--      <div v-for="prop in fGroup.values">-->
<!--                <span>-->
<!--                  <input type="checkbox" v-model="prop.active">-->
<!--                </span>-->
<!--        <span>{{ prop.name }}</span>-->
<!--      </div>-->
    </template>
    <button @click="resetFilter">Сбросить</button>
  </div>
</template>

<style>

</style>