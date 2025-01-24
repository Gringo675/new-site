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
    icon="i-heroicons-queue-list"
    size="md"
    :ui="{ rounded: 'rounded-full' }"
    @click="showMenu"
    label="Каталог"
  />
  <USlideover
    v-model="menuState.show"
    side="left"
    :ui="{
      wrapper: 'z-30',
      width: 'max-w-3xl',
    }"
  >
    <!-- wrapper (do not delete class! used in TheSearch)-->
    <div class="menu-wrapper flex flex-col h-screen">
      <!-- header -->
      <div class="flex items-center gap-x-2 m-2 bg-gray-50">
        <h2>Каталог</h2>
        <TheSearch forMenu />
        <button
          class="ml-auto mr-2 opacity-80 hover:opacity-100 focus:outline-none focus-visible:outline-0"
          @click="menuState.show = false"
        >
          <UIcon
            name="i-heroicons-arrow-long-left-16-solid"
            class="h-8 w-8 block"
          />
        </button>
      </div>
      <!-- columns -->
      <div class="flex overflow-hidden border-t border-gray-300">
        <!-- first col -->
        <div class="flex flex-col gap-y-2 w-80 overflow-auto menu-scrollbar bg-gray-100">
          <div
            v-for="(cat, i) in cats"
            class="pl-4 py-2"
            :class="{ 'bg-gray-200': menuState.activeCatIndex === i }"
            @mouseenter="onMouseEnter(i)"
          >
            <NuxtLink
              class="text-lg font-medium hover:underline underline-offset-8"
              :to="`/catalog/${cat.alias}`"
              @click="closeMenu"
            >
              {{ cat.name }}
            </NuxtLink>
          </div>
        </div>
        <!-- second col -->
        <div class="flex-1 flex flex-col pl-6 pr-4 gap-y-2 overflow-auto menu-scrollbar bg-gray-200 underline-offset-4">
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
                class="ml-4 mb-2 flex flex-col gap-y-2"
              >
                <div
                  v-for="subSubCat in subCat.children"
                  class="flex gap-x-1"
                >
                  <UIcon
                    name="i-heroicons-arrow-turn-down-right-16-solid"
                    class="w-6 h-6 mt-1"
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
