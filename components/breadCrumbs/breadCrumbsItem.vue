<script setup>
//
const props = defineProps({
  crumb: Object,
  noLink: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex items-center gap-x-2">
    <breadCrumbsItemMenu
      v-if="crumb.siblings"
      :items="crumb.siblings"
    />
    <slot
      name="icon"
      v-else
    >
      <UIcon
        name="i-heroicons-slash"
        class="h-6 w-6"
      />
    </slot>

    <span v-if="noLink">{{ crumb.name }}</span>
    <NuxtLink
      v-else
      :to="'/catalog/' + crumb.alias"
      class="underline underline-offset-4"
      >{{ crumb.name }}</NuxtLink
    >
  </div>
</template>
