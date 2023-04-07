<script setup>

const props = defineProps({
  url: {
    type: String,
    required: true
  },
})

const headers = useRequestHeaders(['cookie']) // для запросов типа сервер - сервер, чтобы куки с клиента дошли до API

const _pending = ref(false)
const _error = ref(false)
const {pending, data, error} = await useLazyAsyncData(props.url, () => {
  const cachedData = useNuxtData(props.url).data?.value
  if (cachedData) return cachedData
  return $fetch(props.url, {headers})
})

watch(pending, (pendingValue) => {
  if (pendingValue && data.value) _pending.value = false // заход в useAsyncData для обновления данных (которого не будет)
  else if (!pendingValue && error.value) _pending.value = true // при заходе на страницу с ошибкой первое значение pending = false
  else _pending.value = pendingValue
}, {immediate: true})

watch(error, (errorValue) => {
  if (errorValue) {
    if (process.client && !pending.value) return // повторный заход на страницу, где была ошибка
    _error.value = true
    throw createError(errorValue)
  }
}, {immediate: true})

</script>

<template>
  <div v-if="!_error" class="w-full p-2">
    <Transition name="page" mode="out-in">
      <div v-if="_pending" class="py-3 flex flex-col items-center justify-center cursor-progress">
        <div class="border-[16px] border-t-[#2578FBFF] border-r-[#42ecc8] border-b-[#f7ef72] border-l-[#f34a5f]
        rounded-full w-32 h-32 animate-[spin_2s_linear_infinite]">
        </div>
      </div>
      <div v-else>
        <slot :data="data">some fallback</slot>
      </div>
    </Transition>
  </div>
</template>