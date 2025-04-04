<script setup>
const props = defineProps({
  fGroup: Object,
  index: Number,
})
const emit = defineEmits(['filterChanged'])
const showValues = ref(props.index < 3) // раскрытые для первых трех групп

const activeValues = computed(() => props.fGroup.values.filter(item => item.active))
const inactivateVal = val => {
  const target = props.fGroup.values.find(item => item.val === val)
  target.active = false
  emit('filterChanged')
}
</script>

<template>
  <div class="mb-4">
    <!--    header-->
    <button
      class="relative z-10 flex w-full items-center justify-between rounded-t-md border border-purple-200 bg-orange-200 px-2"
      :class="{ 'rounded-b-md': !showValues && !activeValues.length }"
      @click="showValues = !showValues"
    >
      <span class="text-lg">{{ fGroup.name }}</span>
      <div class="my-1 rounded-xs bg-purple-300 p-1">
        <img
          src="/img/chevron-down.svg"
          class="transition-transform duration-500"
          :class="{ 'rotate-over': showValues }"
        />
      </div>
    </button>
    <!--    values-->
    <transition name="transition-filter-values">
      <div
        v-show="showValues"
        class="-mt-2 max-h-[194px] overflow-hidden border border-purple-200 bg-orange-100"
        :class="{ 'rounded-b-md': !activeValues.length }"
      >
        <div
          class="filter-scrollbar mx-1 mt-3 mb-1 flex max-h-44 overflow-auto max-md:flex-wrap max-md:gap-2 md:flex-col"
        >
          <!-- <div
          class="filter-scrollbar mx-1 mb-1 mt-3 grid max-h-44 grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-2 overflow-auto"
        > -->
          <!-- <div
          class="filter-scrollbar mx-1 mb-1 mt-3 grid max-h-44 grid-cols-[max-content_max-content_max-content] gap-2 overflow-auto"
        > -->
          <label
            v-for="value in fGroup.values"
            class="flex w-fit cursor-pointer items-center gap-2 rounded-xs px-1 hover:bg-gray-100 has-checked:bg-gray-200 has-disabled:cursor-default max-md:border max-md:border-gray-300"
          >
            <input
              type="checkbox"
              v-model="value.active"
              :disabled="value.disabled"
              class="peer"
              @change="emit('filterChanged')"
            />
            <span class="peer-disabled:opacity-40">{{ value.name }}</span>
          </label>
        </div>
      </div>
    </transition>
    <!--    active values-->
    <transition name="transition-filter-active-values">
      <div
        v-show="activeValues.length"
        class="overflow-hidden"
      >
        <div
          class="relative z-10 flex min-h-[30px] flex-wrap rounded-b-md border-x border-b border-purple-200 bg-orange-100 pt-1 text-sm text-indigo-700"
        >
          <div
            v-for="item in activeValues"
            class="mb-1 ml-2 flex w-fit rounded-xs bg-violet-100"
          >
            <span
              class="px-1"
              :class="{ 'line-through': item.disabled }"
            >
              {{ item.name }}
            </span>
            <button
              class="rounded-xs bg-violet-200"
              @click="inactivateVal(item.val)"
            >
              <img src="/img/x.svg" />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style></style>
