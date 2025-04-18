<script setup>
//

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
    title="catsMenu"
    description="catsMenu"
    :ui="{
      content: 'max-w-3xl',
    }"
  >
    <template #content>
      <!-- wrapper -->
      <div class="flex h-screen flex-col">
        <!-- header -->
        <div class="m-2 flex items-center gap-x-2 bg-gray-50 sm:justify-between">
          <button
            class="opacity-80 hover:opacity-100 focus:outline-hidden focus-visible:outline-0"
            @click="hideCatsMenu"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="block h-8 w-8"
            />
          </button>
          <div class="flex min-w-0 grow justify-center">
            <TheSearch class="" />
          </div>
          <div class="font-accent text-2xl whitespace-nowrap max-sm:hidden">ТД ЧИ</div>
        </div>
        <!-- columns -->
        <div class="flex overflow-hidden border-t border-gray-300">
          <!-- first col -->
          <div
            class="menu-scrollbar flex w-80 flex-col gap-2 overflow-auto bg-gray-100 max-md:w-full max-md:flex-row max-md:flex-wrap max-md:p-2"
          >
            <div
              v-for="(cat, i) in cats"
              class="grow py-2 pl-4 max-md:p-0"
              :class="{ 'md:bg-gray-200': menuState.activeCatIndex === i }"
              @mouseenter="onMouseEnter(i)"
            >
              <NuxtLink
                class="text-center text-lg font-medium underline-offset-8 hover:underline max-md:block max-md:w-full max-md:rounded-full max-md:border max-md:border-gray-500 max-md:px-3 max-md:py-2 max-md:text-sm"
                :to="`/catalog/${cat.alias}`"
                @click="hideCatsMenu"
                no-prefetch
              >
                {{ cat.name }}
              </NuxtLink>
            </div>
          </div>
          <!-- second col -->
          <div
            class="menu-scrollbar flex flex-1 flex-col gap-y-2 overflow-auto bg-gray-200 pr-4 pl-6 underline-offset-4 max-md:hidden"
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
                    @click="hideCatsMenu"
                    no-prefetch
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
                        @click="hideCatsMenu"
                        no-prefetch
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
    </template>
  </USlideover>
</template>
