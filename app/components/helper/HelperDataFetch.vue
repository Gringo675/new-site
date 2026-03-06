<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

// убрал передачу cookies, поскольку данный компонент используется только в каталоге для получения категорий и товаров, для чего не требуется авторизация
// const headers = useRequestHeaders(['cookie']) // для запросов типа сервер - сервер, чтобы куки с клиента дошли до API

const { status, data, error } = await useLazyAsyncData(
  props.url,
  () => {
    return $fetch(
      props.url,
      //, { headers }
    )
  },
  {
    getCachedData: key => useNuxtData(key).data?.value,
    deep: false,
    dedupe: 'defer',
  },
)

// если на странице случилась ошибка, и мы заходим на нее повторно, то значение status = error будет изначально.
// поэтому используем watch with immediate = false (default), чтобы пропустить первое значение, а на сервере сразу проверяем на ошибку
if (import.meta.server && status.value === 'error') throw createError(error.value)

watch(status, statusValue => {
  if (statusValue === 'error') throw createError(error.value)
})
</script>

<template>
  <Transition
    name="page"
    mode="out-in">
    <HelperLoader v-if="status !== 'success'" />
    <div v-else>
      <slot :data="data">some fallback</slot>
    </div>
  </Transition>
</template>
