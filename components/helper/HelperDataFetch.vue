<script setup>

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  lazy: {
    type: Boolean,
    default: true
  }
})

const headers = useRequestHeaders(['cookie']) // для запросов типа сервер - сервер, чтобы куки с клиента дошли до API

const {data, pending, error} = await useAsyncData(props.url, async () => {
  // const oldValue = useNuxtData(props.url).data.value
  // if (oldValue) return oldValue // иначе функция вернет старое значение и pending false, а бекграундом запустит обновление данных
  try {
    return await $fetch(props.url, {headers})
  } catch (e) {
    throw createError(e)
  }
}, {
  lazy: props.lazy
})

console.log(`pending: ${JSON.stringify(pending.value, null, 2)}`)
console.log(`data: ${JSON.stringify(data.value !== null, null, 2)}`)
console.log(`error: ${JSON.stringify(error.value, null, 2)}`)

const calculateReady = () => {
  // нужно учесть, что при повторном заходе начальное значение pending будет false,
  // даже если данные еще не получены (предыдущий заход завершился ошибкой)
  if (!pending.value && data.value) return true
  if (error.value) handleError()
  return false
}
const handleError = () => {
  const e = {
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage
  }
  clearNuxtData(props.url)
  throw createError(e)
}

const ready = ref(calculateReady())

if (!ready.value) { // если запрос не разрешился синхронно, вешаем watcher
  watch(() => pending.value, () => ready.value = calculateReady())
}

</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <div v-if="ready" >
        <slot :data="data">some fallback</slot>
      </div>
      <div v-else class="py-3 flex flex-col items-center justify-center cursor-progress">
        <div class="border-[16px] border-t-[#2578FBFF] border-r-[#42ecc8] border-b-[#f7ef72] border-l-[#f34a5f]
        rounded-full w-32 h-32 animate-[spin_2s_linear_infinite]">
        </div>
      </div>
    </Transition>
  </div>
</template>