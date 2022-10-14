<script setup>
const props = defineProps({
  fGroup: Object,
})

const showValues = ref(false)

// const activeValues = computed(() => props.fGroup.values.reduce((result, value) => result + (value.active ? value.name + ' ' : ''), ''))
const activeValues = computed(() => props.fGroup.values.filter(item => item.active))
const unactivateVal = (val) => {
  const target = props.fGroup.values.find(item => item.val === val)
  target.active = false
}
</script>

<template>
  <div class="my-2">
    <!--    header-->
    <div class="border border-purple-200 bg-orange-200 rounded-t-md px-2 z-10 relative
                flex justify-between items-center"
         :class="{'rounded-b-md': !showValues && !activeValues.length}"
    >
      <span class="text-lg">{{ fGroup.name }}</span>
      <button class="my-1 p-1 bg-purple-300 rounded"
              @click="showValues = !showValues"
      >
        <img src="@/img/chevron-down.svg"
             class="transition-transform duration-500"
             :class="{'rotate-over': showValues}"
        >
      </button>
    </div>
    <!--    values-->
    <transition name="transition-filter-values">
      <div v-show="showValues"
           class="bg-orange-100 max-h-[194px] -mt-2 overflow-hidden border border-purple-200"
           :class="{'rounded-b-md': !activeValues.length}"
      >
        <div class="max-h-44  mx-1 mt-3 mb-1 overflow-auto filter-scrollbar">
          <label v-for="value in fGroup.values"
                 class="block"
          >
            <input type="checkbox" v-model="value.active">
            {{ value.name }}
          </label>
        </div>
      </div>
    </transition>
    <!--    active values-->
    <transition name="transition-filter-active-values">
      <div v-show="activeValues.length"
           class="overflow-hidden"
      >
        <div class="flex flex-wrap pt-1 min-h-[30px] bg-orange-100 border-x border-b border-purple-200 rounded-b-md  z-10 relative
         text-sm text-indigo-700">
          <div v-for="item in activeValues"
               class="mb-1 ml-2 flex w-fit bg-violet-100 rounded "
          >
          <span class="px-1 ">
            {{ item.name }}
          </span>
            <button class="bg-violet-200 rounded" @click="unactivateVal(item.val)">
              <img src="@/img/x.svg">
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>

</style>