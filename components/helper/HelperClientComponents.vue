<script setup>
// хелпер для загрузки всех компонентов, используемых только на клиенте

// const feedback = useFeedback()
const user = useUser().value
</script>

<template>
  <ClientOnly>
    <!-- <Transition name="transition-fade"> -->
    <!-- <HelperModalWrapper v-if="feedback.isActive">
        <LazyTheFeedback />
      </HelperModalWrapper> -->
    <!-- </Transition> -->
    <Transition name="transition-fade">
      <HelperModalWrapper v-if="user.showLogin">
        <LazyTheLogin />
      </HelperModalWrapper>
    </Transition>
    <LazyUNotifications />
    <LazyTheMessage />
    <LazyTheLoader />
    <LazyTheFeedback />
  </ClientOnly>
</template>
