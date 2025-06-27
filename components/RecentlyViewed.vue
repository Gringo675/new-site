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
  if (newViewed.length > 7) newViewed.length = 7 // на 1 больше, чем нужно, т.к. будем удалять текущий на странице товара
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
  if (viewed.value.length > 6) viewed.value.length = 6

  if (helper.needUpdateLocal) {
    helper.needUpdate = false
    updateViewed()
  }
}
</script>

<template>
  <div
    v-if="viewed.length"
    class="mt-6 md:-mx-2"
  >
    <USeparator
      label="Просмотренные товары"
      color="primary"
      :ui="{
        container: 'mx-0 px-4 border border-primary rounded-full',
        label: 'text-primary italic font-bold text-lg',
      }"
    />

    <div class="my-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
      <CatalogProductCard
        v-for="prod in viewed"
        :prod="prod"
        class="@container"
      />
    </div>
  </div>
</template>

<style scoped>
.vContainer {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>
