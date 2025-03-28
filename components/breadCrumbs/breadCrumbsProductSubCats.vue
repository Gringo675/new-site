<script setup>
//
const { cats } = defineProps({
  cats: Array,
})
</script>

<template>
  <div class="flex flex-grow flex-col gap-2">
    <div
      v-for="cat in cats"
      class="flex flex-wrap items-start gap-y-2"
    >
      <breadCrumbsItem :crumb="cat" />
      <div
        v-if="cat.children"
        class="ml-2 flex flex-col gap-2"
      >
        <breadCrumbsItem
          v-for="subCat in cat.children"
          :crumb="subCat"
        >
          <template #icon>
            <UIcon
              name="i-heroicons-arrow-turn-down-right"
              class="h-4 w-4"
            />
          </template>
        </breadCrumbsItem>
      </div>
    </div>
  </div>
</template>
