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
    <HelperPopupMenu v-if="crumb.siblings">
      <template #trigger="{ show, open }">
        <UButton
          icon="i-heroicons-chevron-down"
          class="p-1"
          :class="{ 'rotate-over': open }"
          variant="outline"
          aria-label="Развернуть"
          @click="show" />
      </template>
      <template #content>
        <div class="space-y-2">
          <NuxtLink
            v-for="sibling in crumb.siblings"
            :to="'/catalog/' + sibling.alias"
            class="block w-max leading-tight underline-offset-4"
            :class="sibling.current ? 'cursor-default font-bold' : 'hover:underline'">
            {{ sibling.name }}
          </NuxtLink>
        </div>
      </template>
    </HelperPopupMenu>

    <slot
      name="icon"
      v-else>
      <UIcon
        name="i-heroicons-slash"
        class="h-6 w-6" />
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
