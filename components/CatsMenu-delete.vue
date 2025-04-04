<script setup>
//
const { data: cats } = await useCats()

const menuState = reactive({
  show: false,
  activeCatIndex: 0,
})
const showMenu = () => {
  menuState.show = true
  menuState.activeCatIndex = 0
}
const activeCat = computed(() => cats.value[menuState.activeCatIndex])

const onMouseEnter = index => {
  menuState.activeCatIndex = index
}
const closeMenu = () => (menuState.show = false)

const goTo = async url => {
  menuState.show = false
  await navigateTo(url)
}
</script>

<template>
  <UButton
    size="md"
    :ui="{ rounded: 'rounded-full' }"
    @click="showMenu"
  >
    <template #leading>
      <UIcon
        name="i-heroicons-queue-list"
        class="h-5 w-5 max-md:hidden"
      />
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="h-5 w-5 md:hidden"
      />
    </template>
    <span class="max-md:hidden">Каталог</span>
  </UButton>
  <USlideover
    v-model="menuState.show"
    side="left"
    :ui="{
      wrapper: 'z-30',
      width: 'max-w-3xl',
    }"
  >
    <!-- wrapper (do not delete class! used in TheSearch)-->
    <div class="menu-wrapper flex h-screen flex-col">
      <!-- header -->
      <div class="m-2 flex items-center gap-x-2 bg-gray-50">
        <h2>Каталог</h2>
        <TheSearch forMenu />
        <button
          class="mr-2 ml-auto opacity-80 hover:opacity-100 focus:outline-hidden focus-visible:outline-0"
          @click="menuState.show = false"
        >
          <UIcon
            name="i-heroicons-arrow-long-left-16-solid"
            class="block h-8 w-8"
          />
        </button>
      </div>
      <!-- columns -->
      <div class="flex overflow-hidden border-t border-gray-300">
        <!-- first col -->
        <div class="menu-scrollbar flex w-80 flex-col gap-y-2 overflow-auto bg-gray-100">
          <div
            v-for="(cat, i) in cats"
            class="py-2 pl-4"
            :class="{ 'bg-gray-200': menuState.activeCatIndex === i }"
            @mouseenter="onMouseEnter(i)"
          >
            <NuxtLink
              class="text-lg font-medium underline-offset-8 hover:underline"
              :to="`/catalog/${cat.alias}`"
              @click="closeMenu"
            >
              {{ cat.name }}
            </NuxtLink>
          </div>
        </div>
        <!-- second col -->
        <div class="menu-scrollbar flex flex-1 flex-col gap-y-2 overflow-auto bg-gray-200 pr-4 pl-6 underline-offset-4">
          <div class="">
            <div
              v-for="subCat in activeCat.children"
              class="flex flex-col"
            >
              <div class="py-4">
                <NuxtLink
                  class="font-medium hover:underline"
                  :to="`/catalog/${subCat.alias}`"
                  @click="closeMenu"
                >
                  {{ subCat.name }}
                </NuxtLink>
              </div>

              <div
                v-if="subCat.children"
                class="mb-2 ml-4 flex flex-col gap-y-2"
              >
                <div
                  v-for="subSubCat in subCat.children"
                  class="flex gap-x-1"
                >
                  <UIcon
                    name="i-heroicons-arrow-turn-down-right-16-solid"
                    class="mt-1 h-6 w-6"
                  />
                  <div>
                    <NuxtLink
                      class="hover:underline"
                      :to="'/catalog/' + subSubCat.alias"
                      @click="closeMenu"
                    >
                      {{ subSubCat.name }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </USlideover>
</template>
