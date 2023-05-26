<script setup>
// хелпер для загрузки всех компонентов, используемых только на клиенте

const loader = useLoader()
const message = useMessage()
const notice = useNotice()
const feedback = useFeedback()
const user = useUser().value
</script>

<template>
  <ClientOnly>
    <Transition name="transition-loader">
      <TheLoader v-show="loader.isActive" />
    </Transition>
    <Transition name="transition-fade">
      <HelperModalWrapper v-if="message.isActive">
        <LazyTheMessage />
      </HelperModalWrapper>
    </Transition>
    <Transition name="transition-fade">
      <HelperModalWrapper v-if="feedback.isActive">
        <LazyTheFeedback />
      </HelperModalWrapper>
    </Transition>
    <Transition name="transition-informer">
      <LazyTheNotice v-if="notice.isActive" />
    </Transition>
    <Transition name="transition-fade">
      <HelperModalWrapper v-if="user.showLogin">
        <LazyTheLogin />
      </HelperModalWrapper>
    </Transition>
  </ClientOnly>
</template>
