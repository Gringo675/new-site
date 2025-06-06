<script setup>
//
definePageMeta({
  layout: 'empty',
})
// const open = ref(false)

const ttest = () => {
  console.log('ttest')
}
</script>

<template>
  <div class="mt-40 ml-40">
    <HelperPopupMenu contentClass="right-0">
      <template #trigger="{ show }">
        <UButton
          icon="i-heroicons-chevron-down"
          label="Show it"
          class=""
          variant="outline"
          @click="show()"
        />
      </template>
      <template #content>
        <div class="flex flex-col gap-2">
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталг 1 2 3 4 5 6 7 8 9 10</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <!-- <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          > -->
          <!-- <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          > -->
        </div>
      </template>
    </HelperPopupMenu>
    <HelperPopupMenu
      contentClass=""
      class="translate-x-[800px] -translate-y-[34px]"
    >
      <template #trigger="{ show }">
        <UButton
          icon="i-heroicons-chevron-down"
          label="Show it"
          class=""
          variant="outline"
          @click="show()"
        />
      </template>
      <template #content>
        <div class="flex flex-col gap-2">
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталг 1 2 3 4 5 6 7 8 9 10</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <!-- <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          > -->
          <!-- <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 1 Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1Каталог 1</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 2 Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2Каталог 2</NuxtLink
          >
          <NuxtLink
            to="#"
            class="w-fit underline-offset-4 hover:underline"
            >Каталог 3 Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3Каталог 3</NuxtLink
          > -->
        </div>
      </template>
    </HelperPopupMenu>
  </div>
</template>

<style></style>
