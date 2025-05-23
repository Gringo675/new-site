<script setup>
//
useSeoMeta({
  title: 'Корзина',
})

const cart = useCart()
const cartWrapper = useTemplateRef('cartWrapperRef')
const userForm = useTemplateRef('userFormRef')

/**
 * Определяем состояние процесса заказа:
 * state0 - корзина пуста
 * state1 - корзина с товарами + форма для ввода сообщения и прикрепления файлов
 * state2 - оформление заказа
 * state3 - заказ завершен
 */
const cartState = ref(0)
watch(
  () => cart.length,
  newLength => {
    if (newLength > 0) {
      if (cartState.value === 0 && newLength > 0) cartState.value = 1
    } else if (cartState.value !== 3) cartState.value = 0
  },
  { immediate: true },
)
watch(cartState, () => {
  // перемотка вверх при каждом изменении состояния
  cartWrapper.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

let formData = null
const onCartOrderButtonClick = async () => {
  if (cartState.value === 1) {
    // перед переходом к заказу получаем данные с формы в корзине
    formData = await userForm.value.getUserFormData()
    if (!formData) return
    cartState.value = 2
  } else {
    cartState.value = 1
  }
}
const createOrder = async () => {
  // если дошли до этого шага, значит у нас уже есть formData и сохраненный user

  // const formData = new FormData(cartForm)
  // formData.append('cart', JSON.stringify(cart))
  // if (orderHandler.fastOrder) formData.append('user', JSON.stringify(user))
  // orderHandler.orderNumber = await myFetch('/api/user/createOrder', {
  //   method: 'post',
  //   payload: formData,
  // })
  // if (orderHandler.orderNumber > 0) {
  //   orderHandler.step = 4
  //   cart.length = 0 // clear cart
  // }

  const user = useUser().value
  formData.append('user', JSON.stringify(user))
  formData.append('cart', JSON.stringify(cart))

  const orderNumber = await myFetch('/api/user/createOrder', {
    method: 'post',
    payload: formData,
  })
  if (orderNumber > 0) {
    cartState.value = 3
    cart.length = 0 // clear cart
  }
}
</script>

<template>
  <div
    ref="cartWrapperRef"
    class="scroll-mt-16"
  >
    <div
      v-if="cartState === 0"
      class="py-8 text-center"
    >
      <div class="mb-4 text-xl">Ваша корзина пуста.</div>
      <p class="text-muted mb-6">Добавьте товары в корзину для оформления заказа.</p>
      <UButton
        to="/catalog"
        label="Перейти в каталог"
        size="xl"
        color="tertiary"
      />
    </div>
    <div
      class=""
      v-else
    >
      <h1 class="font-accent my-4 text-2xl">{{ cartState === 1 ? 'Корзина' : 'Оформление заказа' }}</h1>

      <HelperAsideGrid
        v-if="cartState !== 3"
        reverse
      >
        <template v-if="cartState === 1">
          <div class="@container flex flex-col gap-2">
            <CatalogProductCard
              v-for="prod in cart"
              :key="prod.id"
              :prod="prod"
            />
          </div>
          <!-- attach comment and file -->
          <TheUserForm
            forCart
            ref="userFormRef"
            class="my-4"
          />
        </template>
        <HelperUserOrder
          v-if="cartState === 2"
          @createOrder="createOrder"
        />
        <template #aside>
          <div class="sticky top-15 rounded-lg border border-violet-200 bg-violet-50 p-2 shadow-lg">
            <h2 class="mb-4 border-b border-gray-200 text-lg font-bold">В корзине</h2>
            <div class="flex flex-col gap-2">
              <div class="flex">
                <div class="">Товаров:</div>
                <div class="ml-auto font-bold">{{ cart.reduce((acc, item) => acc + item.quantity, 0) }}</div>
              </div>
              <div class="flex">
                <div class="">Сумма без НДС:</div>
                <div class="ml-auto font-bold">
                  {{ cart.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString() + ' ₽' }}
                </div>
              </div>
              <div class="flex">
                <div class="">Сумма с НДС:</div>
                <div class="ml-auto font-bold">
                  {{
                    (cart.reduce((total, item) => total + item.quantity * item.price, 0) * 1.2).toLocaleString() + ' ₽'
                  }}
                </div>
              </div>
            </div>

            <UButton
              :label="cartState === 1 ? 'Оформить заказ' : 'Назад в корзину'"
              color="tertiary"
              block
              size="xl"
              class="my-4"
              @click="onCartOrderButtonClick"
            />
          </div>
        </template>
      </HelperAsideGrid>
      <div
        v-else
        class=""
      >
        Заказ оформлен!
      </div>
      <div class="my-4 rounded-lg border border-violet-200 bg-violet-100 p-2 text-sm shadow-lg">
        Вы можете редактировать позиции в корзине, уменьшая и увеличивая количество. Для удаления отдельной позиции
        уменьшите ее количество до нуля. Все требования к заказу, такие, как наличие поверки, включение доставки,
        требования к документации или упаковке, можно указать в комментарии. Реквизиты организации и другую относящуюся
        к заявке информацию можно прикрепить отдельным файлом, нажав соответствующую кнопку. После нажатия кнопки
        «Оформить заказ» введите контактную информацию. На указанную почту Вы получите счет на оплату, либо наш
        сотрудник свяжется с Вами для уточнения деталей заказа. Отгрузка заказов по России осуществляется транспортными
        компаниями, забрать товар самостоятельно можно с нашего склада в Челябинске.
      </div>
    </div>
  </div>
</template>
