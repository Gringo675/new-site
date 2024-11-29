<script setup>
import catFields from '~/composables/admin/cats/catFields'

const masterButton = reactive({
  checked: computed(() => catFields.every(field => field.isActive)),
  indeterminate: computed(() => catFields.some(field => field.isActive) && catFields.some(field => !field.isActive)),
  onInput: value => catFields.forEach(field => (field.isActive = value)),
})
</script>

<template>
  <div class="flex items-center p-2">
    <div class="flex items-center mr-2 shrink-0">
      <img
        class="w-10"
        src="/img/funnel.svg"
        title="Фильтр"
      />
      <input
        type="checkbox"
        :checked="masterButton.checked"
        @input="masterButton.onInput($event.target.checked)"
        :indeterminate="masterButton.indeterminate"
        class="w-5 h-5"
      />
    </div>
    <div class="flex flex-wrap rounded-xl bg-cyan-50 p-1 text-sm">
      <div
        v-for="(field, i) in catFields"
        :key="i"
        class="ml-3"
      >
        <input
          :id="'f_' + field.name"
          class="align-middle"
          type="checkbox"
          v-model="field.isActive"
        />
        <label
          :for="'f_' + field.name"
          class="ml-1 align-middle"
        >
          {{ field.nameRU }}
        </label>
      </div>
    </div>
  </div>
</template>

<style></style>
