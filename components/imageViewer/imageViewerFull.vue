<script setup>
//

// const viewer = useImageViewer()
// const props = getImageViewerData()
// const closeViewer = () => {
//   // console.log(`close viewer...`)
//   viewer.isActive = false
// }

const props = defineProps({
  images: Array,
  activeImgIndex: Number,
  causerId: String,
})

// const onTransitionBeforeEnter = viewer => {
//   if (!props.causerId) return
//   const causer = document.getElementById(props.causerId)
//   if (!causer) return
//   const causerCoords = causer.getBoundingClientRect()

//   viewer.style.setProperty(
//     '--viewer-transition-x',
//     `${Math.round(causerCoords.x + causerCoords.width / 2 - window.innerWidth / 2)}px`,
//   )
//   viewer.style.setProperty(
//     '--viewer-transition-y',
//     `${Math.round(causerCoords.y + causerCoords.height / 2 - window.innerHeight / 2)}px`,
//   )
//   viewer.style.setProperty('--viewer-scale', `${Math.round((causerCoords.width * 100) / window.innerWidth) / 100}`)
// }
</script>

<template>
  <UModal
    title="viewer"
    description="viewer"
    fullscreen
    :ui="{
      content:
        'bg-amber-300/50 data-[state=open]:animate-[scale-in_2000ms_ease-out] data-[state=closed]:animate-[scale-out_2000ms_ease-in]',
    }"
  >
    <template #content>
      <image-viewer-full-inner
        :images="props.images"
        :activeImgIndex="props.activeImgIndex"
      />
    </template>
  </UModal>
  <!-- <transition
    name="viewer"
    @before-enter="onTransitionBeforeEnter"
  >
    <div
      v-if="viewer.isActive"
      class="fixed top-0 right-0 bottom-0 left-0 z-30 overflow-hidden bg-gray-900/90 select-none"
      @click="closeViewer"
      v-focus
      tabindex="-1"
    >
      <button
        @click="closeViewer"
        class="absolute top-0 right-0 z-40 m-4 inline-flex text-slate-500 opacity-60 hover:opacity-100 focus:outline-hidden focus-visible:outline-0"
      >
        <UIcon
          name="i-heroicons-x-circle"
          class="h-14 w-14"
        />
      </button>

      <image-viewer-full-inner />
    </div>
  </transition> -->

  <!-- <UModal
    v-model="viewer.isActive"
    fullscreen
    :overlay="false"
    :ui="{
      wrapper: 'm_wrapper z-30',
      inner: 'm_inner ',
      container: 'm_container ',
      base: 'm_base items-center',
      background: 'bg-gray-800/75',
      transition: {
        enter: 'ease-out duration-[2000ms]',
        enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
        enterTo: 'opacity-100 translate-y-0 sm:scale-100',
        leave: 'ease-in duration-[2000ms]',
        leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
        leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
      },
      // overlay: {
      //   background: 'bg-green-800/75',
      // },
    }"
  >
    <image-viewer-full-inner />
  </UModal> -->
</template>
