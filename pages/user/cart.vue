vue
<script setup>
//
const cart = useCart()
const user = useUser().value

const checkFileSize = event => {
  // > 5 Mb
  if (event.target.files[0]?.size > 5242880) {
    showNotice('Слишком большой файл!', 'error')
    event.target.value = ''
  }
}

const showUserProfile = ref(false)

const createOrder = () => {
  if (!user.auth) {
    user.showLogin = true
    const unwatch = watch(
      () => user.showLogin,
      () => {
        nextTick(() => unwatch()) // watch only once
        if (user.auth) showUserProfile.value = true
      }
    )
  } else showUserProfile.value = true
}

const sendOrder = async () => {
  console.log(`fomr sendOrder`)
  const form = document.forms[0] // comments and file
  const formData = new FormData(form)
  formData.append('cart', JSON.stringify(cart))
  await myFetch('/api/user/createOrder', {
    method: 'post',
    payload: formData,
  })
}
</script>

<template>
  <h1>Cart</h1>
  <div v-if="!cart.length">Корзина пуста!</div>
  <div v-else>
    <!-- products wrapper -->
    <div class="flex flex-col border-2 border-emerald-400 rounded m-2 p-2">
      <!-- product -->
      <div
        v-for="(cartProduct, cartIndex) in cart"
        class="flex border border-teal-300"
      >
        <div class="px-2">{{ cartProduct.id }}</div>
        <div class="px-2">{{ cartProduct.name }}</div>
        <div class="px-2">{{ cartProduct.quantity }} шт.</div>
        <div class="px-2">{{ cartProduct.price }} р.</div>
        <button
          class="m-2 px-2 rounded-md bg-teal-400"
          @click="changeCartQuantity(cartIndex, 0)"
        >
          Delete
        </button>
      </div>
    </div>
    <!-- attach comment and file -->
    <div>
      <h2>Комментарии к заказу</h2>
      <form>
        <textarea
          name="comment"
          class="m-2 p-2 border-2 border-blue-300"
          placeholder="Комментарий"
        ></textarea>
        <input
          name="file"
          type="file"
          @change="checkFileSize"
        />
      </form>
    </div>
    <!-- user info -->
    <div v-if="showUserProfile">
      <TheUserProfile
        fromCart
        @changesHandled="sendOrder"
      />
    </div>

    <div v-else>
      <button
        class="button"
        @click="createOrder"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>
