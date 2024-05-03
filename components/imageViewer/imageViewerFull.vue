<script setup>
//
/**
 * todo:
 * preventClosingAndAnimateScroll
 * z-index on zoomed image (upper than arrows)
 * arrows style
 * close button (always top)
 * create lite component
 * iPad?
 */
const viewer = useImageViewer()
const closeViewer = () => {
  console.log(`close viewer...`)
  // viewer.isActive = false
}

const onTransitionBeforeEnter = el => {
  // set css variables
  el.style.setProperty('--viewer-transition-x', `${viewer.transitionX}px`)
  el.style.setProperty('--viewer-transition-y', `${viewer.transitionY}px`)
  el.style.setProperty('--viewer-scale', `${viewer.scale}`)
}
</script>

<template>
  <transition
    name="viewer"
    @before-enter="onTransitionBeforeEnter"
  >
    <div
      v-if="viewer.isActive"
      class="fixed left-0 top-0 right-0 bottom-0 bg-gray-900/90 z-30 overflow-hidden"
      @click="closeViewer"
      v-focus
      tabindex="-1"
    >
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
