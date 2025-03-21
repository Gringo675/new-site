<script setup>
//
const expand = ref(false)
const contentBlock = useTemplateRef('content-block')
const containerHeight = computed(() => {
  if (!expand.value) return '60px'
  return `${contentBlock.value.scrollHeight + 50}px`
})
</script>

<template>
  <div
    class="cotainer relative m-8 flex h-[100px] border border-black bg-orange-200 transition-[height] duration-[1000ms]"
    :style="{ height: containerHeight }"
  >
    <div class="contentContainer overflow-hidden bg-blue-400">
      <div
        class="content"
        ref="content-block"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </div>
    <div class="overlay absolute bottom-0 flex h-[50px] w-full items-center justify-end bg-green-200/70">
      <UButton
        :label="expand ? 'collapse' : 'expand'"
        @click="expand = !expand"
        class="mr-2"
      />
    </div>
  </div>

  <!-- <div class="cotainer m-8 border border-black bg-orange-200">
    <div
      class="contextContainer min-h-[100px] bg-blue-400 transition-[max-height] duration-1000"
      :class="[expand ? 'max-h-[200px] overflow-auto' : 'max-h-[100px] overflow-hidden']"
    >
      <div class="context h-[300px]"></div>
    </div>
    <div
      class="overlayContainer relative transition-[height] duration-1000"
      :class="[expand ? 'h-[35px]' : 'h-0']"
    >
      <div class="overlay absolute bottom-0 flex w-full justify-end bg-green-200/30">
        <UButton
          label="expand"
          @click="expand = !expand"
        />
      </div>
    </div>
  </div> -->
</template>
