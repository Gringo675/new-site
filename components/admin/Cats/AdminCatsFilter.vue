<script setup>
const fields = await useCatFields

const masterButton = reactive({
  checked: computed(() => fields.every(field => field.isActive)),
  indeterminate: computed(() => fields.some(field => field.isActive) && fields.some(field => !field.isActive)),
  onChange: (value) => fields.forEach(field => field.isActive = value)
})

const vIndeterminate = (el, binding) => { // custom directive v-indeterminate
  el.indeterminate = binding.value
}

</script>

<template>
  <div class="flex justify-start items-center m-2 p-2 border border-cyan-600 bg-cyan-50 rounded-xl">
    <div>Filter:</div>
    <div class="master">
      <input type="checkbox" :checked="masterButton.checked" @change="masterButton.onChange($event.target.checked)"
             v-indeterminate="masterButton.indeterminate">
    </div>
    <div v-for="(field, i) in fields" :key="i" class="ml-3">
      <input :id="'f_' + field.name" class="align-middle" type="checkbox" v-model="field.isActive">
      <label :for="'f_' + field.name" class="ml-1 align-middle"> {{ field.nameRU }} </label>
    </div>
  </div>
</template>

<style lang="scss">

</style>