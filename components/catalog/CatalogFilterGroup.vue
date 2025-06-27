<script setup>
const props = defineProps({
  fGroup: Object,
  index: Number,
});
const emit = defineEmits(["filterChanged"]);
const showValues = ref(props.index < 3); // раскрытые для первых трех групп

const activeValues = computed(() =>
  props.fGroup.values.filter((item) => item.active),
);
const inactivateVal = (val) => {
  const target = props.fGroup.values.find((item) => item.val === val);
  target.active = false;
  emit("filterChanged");
};
</script>

<template>
  <div class="mb-4">
    <div
      class="overflow-hidden rounded-lg border border-orange-300 bg-orange-200"
    >
      <div class="flex items-center justify-between gap-2 px-2">
        <span class="py-1 text-lg leading-5">{{ fGroup.name }}</span>
        <UButton
          icon="i-heroicons-chevron-down"
          class="my-1 p-1 transition-transform duration-500"
          @click="showValues = !showValues"
          :class="{ 'rotate-over': showValues }"
        />
      </div>
      <div
        class="overflow-hidden bg-orange-100 transition-[max-height] duration-500 ease-out"
        :class="showValues ? 'max-h-50' : 'max-h-0'"
      >
        <div
          class="menu-scrollbar m-2 mr-1 flex max-h-46 items-start overflow-auto pr-1 max-md:flex-wrap max-md:gap-2 md:flex-col"
        >
          <label
            v-for="value in fGroup.values"
            class="flex cursor-pointer items-center gap-2 rounded-xs p-1 hover:bg-gray-100 has-checked:bg-gray-200 has-disabled:cursor-default max-md:border max-md:border-gray-300"
          >
            <input
              type="checkbox"
              v-model="value.active"
              :disabled="value.disabled"
              class="peer"
              @change="emit('filterChanged')"
            />
            <span class="leading-[15px] peer-disabled:opacity-40">{{
              value.name
            }}</span>
          </label>
        </div>
      </div>
      <div
        class="overflow-hidden bg-orange-50 transition-[max-height] duration-500 ease-out"
        :class="activeValues.length ? 'max-h-20' : 'max-h-0'"
      >
        <div
          class="menu-scrollbar m-2 mr-1 flex max-h-16 flex-wrap gap-2 overflow-auto pr-1 text-sm text-indigo-700"
        >
          <div
            v-for="item in activeValues"
            class="flex rounded-xs bg-violet-100"
          >
            <span class="px-1" :class="{ 'line-through': item.disabled }">
              {{ item.name }}
            </span>
            <button
              class="cursor-pointer rounded-xs bg-violet-200"
              @click="inactivateVal(item.val)"
            >
              <UIcon
                name="i-heroicons-x-mark"
                class="block size-4 text-indigo-700"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
