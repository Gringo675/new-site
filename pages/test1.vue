<script setup>
//
const state = reactive({
  aaa: 111,
  bbb: 222,
  ccc: 333,
  ddd: 444,
})

const pState = new Proxy(state, {
  // get(target, key) {
  //   console.log(`from getter`)
  //   return Number(target[key])
  // },
  set(target, key, value) {
    console.log(`from setter value: ${value}`)
    if (Number(value) === 0) {
      confirmDelete().then(r => {
        if (r === true) delete target[key]
        else {
          const cache = target[key]
          target[key] = 1
          nextTick(() => {
            console.log(`from nextTick`)
            target[key] = cache
          })
        }
      })
      // delete target[key]
    } else target[key] = Number(value)
    return true
  },
})

const confirmDelete = () => {
  // return promise
  return showMessage({
    title: 'Подтвердите удаление',
    description: `Товар(-ы) будут удалены из корзины без возможности восстановления. Продолжить?`,
    isDialog: true,
  })
}
</script>

<template>
  <div>
    <div>{{ state }}</div>
  </div>
  <div>
    <!-- <UInput :modelValue="state.aaa" /> -->
    <UInput v-model.lazy="pState.aaa" />
  </div>
</template>
