<script setup>
//
const viewed = shallowRef([])
const route = useRoute()
const addToViewed = useAddToViewed()

const getViewedFromLocalStore = async () => {
  const storViewed = JSON.parse(localStorage.getItem('VIEWED'))
  if (!storViewed?.length) return
  const products = await myFetch('/api/getProducts', {
    method: 'post',
    payload: storViewed,
    silent: true,
  })
  if (!products) return
  viewed.value = storViewed.map(id => products.find(p => p.id === id))
  console.log(`начальная инициализация закончена`)
}
getViewedFromLocalStore()

console.log(`watch activated for addToViewed`)
watch(addToViewed, setProductToViewed)
function setProductToViewed(newProduct) {
  console.log(`from addToViewed watcher prod: ${newProduct.name}`)
  const newViewed = JSON.parse(localStorage.getItem('VIEWED')) ?? [] // обрабатывать нужно localStore, т.к. в него можно внести изменения из других вкладок

  viewed.value.push(newProduct) // будет использоваться как кеш, порядок не важен
  const existingIndex = newViewed.indexOf(newProduct.id) // если товар уже есть в просмотренных
  if (existingIndex !== -1) newViewed.splice(existingIndex, 1)
  newViewed.unshift(newProduct.id)
  if (newViewed.length > 4) newViewed.length = 4 // viewed should be limited to 4 items
  console.log(`changed newViewed: ${JSON.stringify(newViewed, null, 2)}`)
  localStorage.setItem('VIEWED', JSON.stringify(newViewed))

  console.log(`watch activated for route`)
  watch(
    () => route.path,
    async () => {
      console.log(`from route watcher`)
      const missingIds = newViewed.filter(id => !viewed.value.some(p => p.id === id))
      if (missingIds.length) {
        const missingProds = await myFetch('/api/getProducts', {
          method: 'post',
          payload: missingIds,
          silent: true,
        })
        if (!missingProds) return
        console.log(`after request viewed.value: ${JSON.stringify(viewed.value, null, 2)}`)
        console.log(`newViewed: ${JSON.stringify(newViewed, null, 2)}`)
        viewed.value.push(...missingProds)
      }
      viewed.value = newViewed.map(id => viewed.value.find(p => p.id === id)) // trigger reactivity on route change
      console.log(`created viewed.value: ${JSON.stringify(viewed.value, null, 2)}`)
    },
    { once: true },
  )
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
