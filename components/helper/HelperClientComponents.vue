<script setup>
// хелпер для загрузки всех компонентов, используемых только на клиенте

const user = useUser().value
const message = useMessage()
const feedback = useFeedback()
</script>

<template>
  <ClientOnly>
    <!-- <UModal
      v-model="user.showLogin"
      prevent-close
    >
      <LazyTheLogin />
    </UModal> -->
    <UModal
      v-model="message.active"
      :prevent-close="message.preventClose"
    >
      <!-- <LazyTheMessage /> -->
    </UModal>
    <!-- <UModal
      v-model="feedback.isActive"
      prevent-close
      :ui="{
        width: 'md:max-w-2xl lg:max-w-4xl',
      }"
    >
      <LazyTheFeedback />
    </UModal>
    <TheLoader />
    <UNotifications />
    <ImageViewerFull />
    <USlideovers /> -->
  </ClientOnly>
</template>
