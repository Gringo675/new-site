<script setup>
//
const { data: cats } = await useCats()
const showMenu = ref(false)

const goTo = async url => {
  showMenu.value = false
  await navigateTo(url)
}
</script>

<template>
  <UButton
    label="Каталог"
    @click="showMenu = true"
  />
  <USlideover
    v-model="showMenu"
    side="left"
    :ui="{
      wrapper: 'z-30',
      // probably bug, only this way works
      base: 'w-3xl',
      width: 'w-3xl max-w-3xl',
    }"
  >
    <!-- wrapper -->
    <div class="flex gap-x-2 h-screen">
      <!-- first col -->
      <div class="flex flex-col w-64 bg-green-100">
        <div class="w-40 h-20 bg-blue-200 text-center">Logo</div>
        <h1>Каталог</h1>
        <div class="flex flex-col gap-y-1 overflow-auto">
          <UButton
            v-for="cat in cats"
            variant="link"
            :label="cat.name"
            @click="goTo(`/catalog/${cat.alias}`)"
          />
        </div>
      </div>
      <!-- second col -->
      <div class="flex flex-col bg-fuchsia-100">
        <TheSearch />
        <div class="w-64 bg-blue-200">subCats</div>
      </div>
    </div>
  </USlideover>
</template>
