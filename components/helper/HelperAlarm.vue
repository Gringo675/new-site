<script setup>
//
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info', // info, error, success
  },
  icon: {
    type: String,
    default: 'i-mynaui-info-waves',
  },
})

const iconClasses = {
  info: 'text-indigo-500',
  error: 'text-red-500',
  success: 'text-green-500',
}
</script>

<template>
  <div class="max-xs:flex-col max-xs:items-center my-6 flex gap-2 rounded-lg border border-indigo-300 bg-indigo-50 p-2">
    <UIcon
      :name="icon"
      class="max-xs:size-6 size-10 shrink-0 max-md:size-8"
      :class="iconClasses[type]"
    />
    <div class="grow">
      <div
        class="leading-tight font-bold"
        v-html="title"
      ></div>
      <div
        class="leading-tight"
        v-html="description"
      ></div>
    </div>
  </div>
</template>
