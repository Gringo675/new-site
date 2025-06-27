<script setup>
//
const props = defineProps({
  crumb: Object,
  noLink: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex items-center gap-x-2">
    <HelperPopupMenu v-if="crumb.siblings">
      <template #trigger="{ show }">
        <UButton
          icon="i-heroicons-chevron-down"
          class="p-1"
          variant="outline"
          @click="show"
        />
      </template>
      <template #content>
        <div class="flex w-max flex-col items-start gap-2">
          <NuxtLink
            v-for="sibling in crumb.siblings"
            :to="'/catalog/' + sibling.alias"
            class="leading-tight underline-offset-4 hover:underline"
            :class="{
              'cursor-default font-bold hover:no-underline': sibling.current,
            }"
          >
            {{ sibling.name }}
          </NuxtLink>
        </div>
      </template>
    </HelperPopupMenu>

    <slot name="icon" v-else>
      <UIcon name="i-heroicons-slash" class="h-6 w-6" />
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
