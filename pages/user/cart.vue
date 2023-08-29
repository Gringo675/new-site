vue
<script setup>
//
const cart = useCart()
const user = useUser().value

/**
 * Условно разделяем процесс заказа на следующие шаги:
 * step1 - начальный экран. Можно управлять товарами в корзине, написать комментарий и прикрепить файлы.
 * step2 - проверяем, авторизирован ли юзер, если нет, предлагаем авторизироваться или оформить быстрый заказ.
 * step3 - показываем форму с контактной информацией и кнопкой "Отправить".
 * step4 - заказ завершен. Показываем финальную информацию.
 */

const TheUserProfileData = reactive({
  isUserDataChanged: false,
  isUserDataValid: false,
  saveUserData: () => {},
})

const orderHandler = reactive({
  step: 1,
  fastOrder: false,
  orderNumber: null,
})

const createOrderStep2 = () => {
  if (!user.auth) orderHandler.step = 2
  else orderHandler.step = 3
}

const loginHandler = () => {
  user.showLogin = true
  const unwatch = watch(
    () => user.showLogin,
    () => {
      nextTick(() => unwatch()) // watch only once
      if (user.auth) orderHandler.step = 3
    }
  )
}

const fastOrderHandler = () => {
  orderHandler.step = 3
  orderHandler.fastOrder = true
}

const sendOrder = async () => {
  if (TheUserProfileData.isUserDataChanged) {
    const isUserSaved = await TheUserProfileData.saveUserData()
    // @ts-ignore
    if (!isUserSaved) return
  }

  const cartForm = document.getElementById('cart_form') // comments and files
  // @ts-ignore
  const formData = new FormData(cartForm)
  formData.append('cart', JSON.stringify(cart))
  if (orderHandler.fastOrder) formData.append('user', JSON.stringify(user))
  orderHandler.orderNumber = await myFetch('/api/user/createOrder', {
    method: 'post',
    payload: formData,
  })
  if (orderHandler.orderNumber > 0) {
    orderHandler.step = 4
    clearCart()
  }
}
</script>

<template>
  <template v-if="orderHandler.step !== 4">
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
        <form id="cart_form">
          <textarea
            name="comment"
            class="m-2 p-2 border-2 border-blue-300"
            placeholder="Комментарий"
          ></textarea>
          <input
            name="files"
            type="file"
            multiple
            @change="checkFormFiles"
          />
        </form>
      </div>
      <div v-if="orderHandler.step === 1">
        <button
          class="button"
          @click="createOrderStep2"
        >
          Оформить заказ
        </button>
      </div>
      <div v-else-if="orderHandler.step === 2">
        <div>Вы не авторизированы на сайте...</div>
        <button
          class="button"
          @click="loginHandler"
        >
          Войти/Зарегистрироваться
        </button>
        <button
          class="button"
          @click="fastOrderHandler"
        >
          Быстрый заказ без регистрации
        </button>
      </div>
      <div v-else-if="orderHandler.step === 3">
        <TheUserProfile
          @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
          @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
          @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
        />
        <div>
          <button
            @click="sendOrder"
            :disabled="!TheUserProfileData.isUserDataValid"
            class="button"
          >
            Создать заказ
          </button>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div>Заказ {{ orderHandler.orderNumber > 1 ? `№${orderHandler.orderNumber}` : '' }} успешно создан!</div>
    <div>На почту {{ user.mail }} отправлено письмо, содержащее информацию по заказу.</div>
  </template>
</template>
