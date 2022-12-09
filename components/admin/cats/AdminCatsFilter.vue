<script setup>
import catFields from "~/composables/admin/cats/catFields"

const masterButton = reactive({
  checked: computed(() => catFields.every(field => field.isActive)),
  indeterminate: computed(() => catFields.some(field => field.isActive) && catFields.some(field => !field.isActive)),
  onChange: (value) => catFields.forEach(field => field.isActive = value)
})

const vIndeterminate = (el, binding) => { // custom directive v-indeterminate
  el.indeterminate = binding.value
}

</script>

<template>
  <div class="flex items-center p-2 border border-cyan-600 bg-cyan-100 rounded-xl">
    <div class="flex items-center mr-2 shrink-0">
      <img class="w-10"
           src="/img/funnel.svg"
           title="Фильтр"
      >
      <input type="checkbox" :checked="masterButton.checked" @change="masterButton.onChange($event.target.checked)"
             v-indeterminate="masterButton.indeterminate"
             class="w-5 h-5"
      >
    </div>
    <div class="flex flex-wrap rounded-xl bg-cyan-50 p-1">
      <div v-for="(field, i) in catFields" :key="i" class="ml-3">
        <input :id="'f_' + field.name" class="align-middle" type="checkbox" v-model="field.isActive">
        <label :for="'f_' + field.name" class="ml-1 align-middle"> {{ field.nameRU }} </label>
      </div>
    </div>
  </div>
</template>

<style>

</style>