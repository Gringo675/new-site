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
      props.url
      //, { headers }
    )
  },
  {
    getCachedData: key => useNuxtData(key).data?.value,
    deep: false,
    dedupe: 'defer',
  }
)

// если на странице случилась ошибка, и мы заходим на нее повторно, то значение status = error будет изначально.
// поэтому используем watch with immediate = false (default), чтобы пропустить первое значение, а на сервере сразу проверяем на ошибку
if (import.meta.server && status.value === 'error') throw createError(error.value)

watch(status, statusValue => {
  if (statusValue === 'error') throw createError(error.value)
})
</script>

<template>
  <div class="w-full p-2">
    <Transition
      name="page"
      mode="out-in"
    >
      <div
        v-if="status !== 'success'"
        class="py-3 flex flex-col items-center justify-center cursor-progress"
      >
        <div
          class="border-[16px] border-t-[#2578FBFF] border-r-[#42ecc8] border-b-[#f7ef72] border-l-[#f34a5f] rounded-full w-32 h-32 animate-[spin_2s_linear_infinite]"
        ></div>
      </div>
      <div v-else>
        <slot :data="data">some fallback</slot>
      </div>
    </Transition>
  </div>
</template>
