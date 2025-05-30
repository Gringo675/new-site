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
  <div class="mt-80 ml-20">
    <HelperPopupMenu>
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
        <div class="">
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
        </div>
      </template>
    </HelperPopupMenu>
  </div>
</template>

<style></style>
