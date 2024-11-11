<script setup>
//
// const router = useRouter()

const changed = ref(false)

const beforeUnloadHandler = event => {
  if (!changed.value) return
  event.preventDefault()
  event.returnValue = true
}

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeRouteLeave(async to => {
  if (!changed.value) return

  console.log(`onBeforeRouteLeave`)

  const proceed = await showMessage({
    title: 'Подтвердите переход со страницы',
    description: 'Есть несохраненные изменения. Если продолжить, они будут утеряны.',
    type: 'error',
    isDialog: true,
  })

  if (!proceed) return false
})

const TheTestStore = reactive({
  show: false,
  resolve: null,
})
</script>

<template>
  <UButton @click="changed = !changed">change</UButton>
  <div>changed: {{ changed }}</div>
  <div>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus, officia repellendus non, doloremque numquam
    cupiditate ab dicta quo ut, debitis recusandae in distinctio quidem quae! Velit quo hic aperiam debitis?Lorem ipsum
    dolor sit amet consectetur, adipisicing elit. Nulla quibusdam rerum, corrupti voluptatum illo aliquam nam dolore
    quaerat voluptatem vero repellat adipisci error est, consequuntur quam recusandae doloribus perferendis qui?lorem
  </div>
  <TheTest
    v-if="TheTestStore.show"
    :store="TheTestStore"
  />
</template>
