<script setup>
//

const viewer = useImageViewer()
const viewerData = getImageViewerData()
const closeViewer = () => {
  // console.log(`close viewer...`)
  viewer.isActive = false
}

const onTransitionBeforeEnter = viewer => {
  if (!viewerData.causerId) return
  const causer = document.getElementById(viewerData.causerId)
  if (!causer) return
  const causerCoords = causer.getBoundingClientRect()

  viewer.style.setProperty(
    '--viewer-transition-x',
    `${Math.round(causerCoords.x + causerCoords.width / 2 - window.innerWidth / 2)}px`
  )
  viewer.style.setProperty(
    '--viewer-transition-y',
    `${Math.round(causerCoords.y + causerCoords.height / 2 - window.innerHeight / 2)}px`
  )
  viewer.style.setProperty('--viewer-scale', `${Math.round((causerCoords.width * 100) / window.innerWidth) / 100}`)
}
</script>

<template>
  <transition
    name="viewer"
    @before-enter="onTransitionBeforeEnter"
  >
    <div
      v-if="viewer.isActive"
      class="fixed left-0 top-0 right-0 bottom-0 bg-gray-900/90 z-30 overflow-hidden select-none"
      @click="closeViewer"
      v-focus
      tabindex="-1"
    >
      <button
        @click="closeViewer"
        class="absolute top-0 right-0 z-40 m-4 inline-flex text-slate-500 opacity-60 hover:opacity-100 focus:outline-none focus-visible:outline-0"
      >
        <UIcon
          name="i-heroicons-x-circle"
          class="h-14 w-14"
        />
      </button>

      <image-viewer-full-inner />
    </div>
  </transition>

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
