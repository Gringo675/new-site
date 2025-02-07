<script setup>
//
const closeMenu = useSlideover().close

const { data: cats } = await useCats()

const menuState = reactive({
  activeCatIndex: 0,
})

const activeCat = computed(() => cats.value[menuState.activeCatIndex])

const onMouseEnter = index => {
  menuState.activeCatIndex = index
}
</script>

<template>
  <USlideover
    side="left"
    :ui="{
      wrapper: 'z-30',
      width: 'max-w-screen-md',
    }"
  >
    <!-- wrapper -->
    <div class="flex flex-col h-screen">
      <!-- header -->
      <div class="flex items-center gap-x-2 m-2 bg-gray-50 sm:justify-between">
        <button
          class="opacity-80 hover:opacity-100 focus:outline-none focus-visible:outline-0"
          @click="closeMenu"
        >
          <UIcon
            name="i-heroicons-x-mark"
            class="h-8 w-8 block"
          />
        </button>
        <div class="flex-grow min-w-0 flex justify-center">
          <TheSearch class="" />
        </div>
        <div class="font-accent text-2xl whitespace-nowrap -sm:hidden">ТД ЧИ</div>
      </div>
      <!-- columns -->
      <div class="flex overflow-hidden border-t border-gray-300">
        <!-- first col -->
        <div
          class="flex flex-col gap-2 w-80 overflow-auto menu-scrollbar bg-gray-100 -md:w-full -md:flex-row -md:flex-wrap -md:pt-2"
        >
          <div
            v-for="(cat, i) in cats"
            class="pl-4 py-2"
            :class="{ 'md:bg-gray-200': menuState.activeCatIndex === i }"
            @mouseenter="onMouseEnter(i)"
          >
            <NuxtLink
              class="text-lg font-medium hover:underline underline-offset-8 -md:px-3 -md:py-2 -md:border -md:border-gray-500 -md:rounded-full -md:text-sm"
              :to="`/catalog/${cat.alias}`"
              @click="closeMenu"
            >
              {{ cat.name }}
            </NuxtLink>
          </div>
        </div>
        <!-- second col -->
        <div
          class="flex-1 flex flex-col pl-6 pr-4 gap-y-2 overflow-auto menu-scrollbar bg-gray-200 underline-offset-4 -md:hidden"
        >
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
