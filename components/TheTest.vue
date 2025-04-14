<script setup>
//
import { LazyModalExample, LazyTheMessage, LazyTheLoader, LazyMobileMenuSlider } from '#components'

const count = ref(0)

const toast = useToast()
const overlay = useOverlay()

const modal = overlay.create(LazyModalExample, {
  props: {
    count: count.value,
  },
})

const message = overlay.create(LazyTheMessage)

const loader = overlay.create(LazyTheLoader)

// const mobileMenu = overlay.create(LazyMobileMenuSlider)

const openLoader = () => {
  showLoader()
  setTimeout(() => {
    showLoader()
  }, 2000)
  setTimeout(() => {
    hideLoader()
  }, 5000)
  setTimeout(() => {
    hideLoader()
  }, 7000)
}
async function openExample() {
  const shouldIncrement = await modal.open({
    title: 'Hello',
    description:
      'lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    // content: 'body',
    // fullscreen: true,
  })

  if (shouldIncrement) {
    count.value++

    toast.add({
      title: `Success: ${shouldIncrement}`,
      color: 'success',
      id: 'modal-success',
    })

    // Update the count
    modal.patch({
      count: count.value,
    })
    return
  }

  toast.add({
    title: `Dismissed: ${shouldIncrement}`,
    color: 'error',
    id: 'modal-dismiss',
  })
}

const sshowMessage = async () => {
  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: '<p>Категория "Без имени" будет удалена.</p><p>Продолжить?</p>',
    // isDialog: true,
  })

  console.log(`proceed: ${JSON.stringify(proceed, null, 2)}`)
}
</script>

<template>
  <div class="flex gap-4">
    <UButton
      label="Open example"
      color="neutral"
      @click="openExample"
    />
    <UButton
      label="Open message"
      color="neutral"
      variant="subtle"
      @click="sshowMessage"
    />
    <UButton
      label="Open loader"
      color="neutral"
      variant="subtle"
      @click="openLoader"
    />
    <UButton
      label="Open mobile menu"
      color="neutral"
      variant="subtle"
      @click="showMobileMenu"
      class="z-20"
    />
    <UButton
      label="Open cats menu"
      color="neutral"
      variant="subtle"
      @click="showCatsMenu"
      class="z-20"
    />
    <UButton
      label="Open feedback"
      color="neutral"
      variant="subtle"
      @click="showFeedback"
    />
    <UButton
      label="Show login"
      color="neutral"
      variant="subtle"
      @click="showLogin"
    />
  </div>
</template>
