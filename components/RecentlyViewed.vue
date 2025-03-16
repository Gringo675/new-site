<script setup>
//
/**
 * Логика работы:
 * Страница товара отправляет объект с данными о товаре, заносим в кеш и localStore.
 * Данный компонент отслеживает переход на другую страницу, берет данные из localStore и если требуется, обновляет Просмотренные товары.
 */
const viewed = shallowRef([])
const route = useRoute()
const addToViewed = useAddToViewed()
const helper = {
  inProgress: false,
  needUpdate: false,
  cache: [],
}

onMounted(() => {
  watch(addToViewed, updateLocal)
  watch(() => route.path, updateViewed, { immediate: true }) // immediate for the first load
})

async function updateLocal(newProduct) {
  const newViewed = JSON.parse(localStorage.getItem('VIEWED')) ?? [] // обрабатывать нужно localStore, т.к. в него можно внести изменения с других вкладок
  helper.cache.push(newProduct)
  const existingIndex = newViewed.indexOf(newProduct.id) // если товар уже есть в просмотренных
  if (existingIndex !== -1) newViewed.splice(existingIndex, 1)
  newViewed.unshift(newProduct.id)
  if (newViewed.length > 5) newViewed.length = 5 // на 1 больше, чем нужно, т.к. будем удалять текущий на странице товара
  localStorage.setItem('VIEWED', JSON.stringify(newViewed))
}

async function updateViewed() {
  await new Promise(r => setTimeout(r, 4000)) // pause should be more than on the product page

  if (helper.inProgress) {
    helper.needUpdate = true
    return
  }

  const localViewed = JSON.parse(localStorage.getItem('VIEWED')) ?? []
  if (localViewed === viewed.value.map(p => p.id)) return

  const missingIds = localViewed.filter(id => !helper.cache.some(p => p.id === id))
  if (missingIds.length) {
    helper.inProgress = true
    console.log(`missingIds: ${JSON.stringify(missingIds, null, 2)}`)
    const missingProds = await myFetch('/api/getProducts', {
      method: 'post',
      payload: missingIds,
      silent: true,
    })
    helper.inProgress = false
    if (!missingProds) return
    helper.cache.push(...missingProds)
  }

  viewed.value = localViewed.map(id => helper.cache.find(p => p.id === id))
  if (route.params.p_alias) {
    // находимся на странице товара, удаляем текущий товар из просмотренных
    const currentInd = viewed.value.findIndex(p => p.alias === route.params.p_alias)
    if (currentInd !== -1) viewed.value.splice(currentInd, 1)
  }
  if (viewed.value.length > 4) viewed.value.length = 4

  if (helper.needUpdateLocal) {
    helper.needUpdate = false
    updateViewed()
  }
}
</script>

<template>
  <div
    v-if="viewed.length"
    class="absolute bottom-0 left-0 right-0 m-2 bg-rose-200"
  >
    <h2 class="py-2 text-lg font-semibold">Вы недавно смотрели</h2>
    <div class="grid grid-cols-4 gap-2 -xl:grid-cols-2 -sm:grid-cols-1">
      <!-- <div class="grid grid-cols-1 gap-2 @container"> -->
      <CatalogProductCard
        v-for="prod in viewed"
        :prod="prod"
        class="@container"
      />
    </div>
  </div>
</template>
