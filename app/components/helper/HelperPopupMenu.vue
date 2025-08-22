<script setup>
//
const props = defineProps({
  contentClass: {
    type: String,
    default: '',
  },
})

const open = defineModel('open', { type: Boolean, default: false })
const show = () => (open.value = true)
const close = () => (open.value = false)

const handleContentClick = event => {
  if (event.target.closest('a') || event.target.closest('button')) {
    open.value = false
  } else event.stopPropagation()
}

const contentRef = useTemplateRef('contentRef')
const handleContentSize = () => {
  const rect = contentRef.value.getBoundingClientRect()
  const viewportWidth = document.documentElement.clientWidth
  const viewportHeight = document.documentElement.clientHeight
  contentRef.value.style.maxHeight = `${viewportHeight - rect.top}px` // transition-below adds 20px
  if (rect.left < 0) contentRef.value.style.maxWidth = `${rect.width + rect.left - 10}px`
  else if (rect.right > viewportWidth)
    contentRef.value.style.maxWidth = `${rect.width - (rect.right - viewportWidth) - 10}px`
}
const installCloseListener = () => {
  window.addEventListener('click', close, { once: true })
}
const removeCloseListener = () => {
  window.removeEventListener('click', close)
}
</script>

<template>
  <div class="relative">
    <slot
      name="trigger"
      :show="show" />
    <Transition
      name="transition-below"
      @enter="handleContentSize"
      @after-enter="installCloseListener"
      @after-leave="removeCloseListener">
      <div
        v-if="open"
        class="absolute z-20 mt-2 overflow-hidden rounded-lg border border-violet-300 bg-violet-100 px-1 py-3 shadow-md"
        :class="contentClass"
        @click="handleContentClick">
        <div
          ref="contentRef"
          class="menu-scrollbar overflow-auto px-2">
          <slot name="content" />
        </div>
      </div>
    </Transition>
  </div>
</template>
