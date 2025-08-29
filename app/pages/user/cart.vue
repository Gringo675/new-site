<script setup>
//
useTitle('Корзина')
const user = useUser()

const cart = useCart()
const cartTotal = computed(() => {
  const summ = cart.reduce((total, item) => total + item.quantity * item.price, 0)
  const Formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  })
  return {
    items: cart.reduce((acc, item) => acc + item.quantity, 0),
    total: Formatter.format(summ),
    totalWithVat: Formatter.format(summ * 1.2),
  }
})
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

const orderNumber = ref(0)
const createOrder = async () => {
  // если дошли до этого шага, значит у нас уже есть formData и сохраненный user

  formData.append('user', JSON.stringify(user.value))
  const cartItems = cart.map(item => ({
    id: item.id,
    image: item.image,
    name: item.name,
    alias: item.alias,
    price: item.price,
    quantity: item.quantity,
  }))
  formData.append('cart', JSON.stringify(cartItems))

  orderNumber.value = await myFetch('/api/user/createOrder', {
    method: 'post',
    payload: formData,
  })
  if (orderNumber.value > 0) {
    cartState.value = 3
    cart.length = 0
  }
}

const clearCart = async () => {
  const proceed = await showMessage({
    title: 'Очистка корзины',
    description: `Товары будут удалены из корзины без возможности восстановления. Продолжить?`,
    isDialog: true,
    type: 'error',
  })
  if (proceed) {
    cart.length = 0
    cartState.value = 0
  }
}
</script>

<template>
  <div
    ref="cartWrapperRef"
    class="scroll-mt-16">
    <div
      v-if="cartState === 0"
      class="py-8 text-center">
      <div class="mb-4 text-xl">Ваша корзина пуста.</div>
      <p class="text-muted mb-6">Добавьте товары в корзину для оформления заказа.</p>
      <UButton
        to="/catalog"
        label="Перейти в каталог"
        size="xl"
        color="tertiary" />
    </div>
    <div
      class=""
      v-else>
      <h1 class="font-accent my-4 text-2xl">{{ cartState === 1 ? 'Корзина' : 'Оформление заказа' }}</h1>
      <template v-if="cartState !== 3">
        <HelperAsideGrid reverse>
          <template v-if="cartState === 1">
            <div class="@container flex flex-col gap-2">
              <CatalogProductCard
                v-for="prod in cart"
                :key="prod.id"
                :prod="prod" />
            </div>
            <UButton
              class="float-right my-2"
              label="Очистить корзину"
              color="error"
              variant="ghost"
              icon="i-heroicons-trash-solid"
              @click="clearCart" />
            <!-- attach comment and file -->
            <TheUserForm
              forCart
              ref="userFormRef"
              class="my-6" />
          </template>
          <HelperUserOrder
            v-if="cartState === 2"
            @createOrder="createOrder" />
          <template #aside>
            <div class="sticky top-15 rounded-lg border border-violet-200 bg-violet-50 p-2 shadow-lg">
              <h2 class="mb-4 border-b border-gray-200 text-lg font-bold">В корзине</h2>
              <div class="flex flex-col gap-2">
                <div class="flex">
                  <div class="">Товаров:</div>
                  <div class="ml-auto font-bold">{{ cartTotal.items }}</div>
                </div>
                <div class="flex">
                  <div class="">Сумма без НДС:</div>
                  <div class="ml-auto font-bold">
                    {{ cartTotal.total }}
                  </div>
                </div>
                <div class="flex">
                  <div class="">Сумма с НДС:</div>
                  <div class="ml-auto font-bold">
                    {{ cartTotal.totalWithVat }}
                  </div>
                </div>
              </div>
              <div class="mx-auto my-4 max-w-80">
                <UButton
                  :label="cartState === 1 ? 'Оформить заказ' : 'Назад в корзину'"
                  :icon="cartState === 1 ? 'i-heroicons-shopping-cart-solid' : 'i-heroicons-arrow-left-solid'"
                  color="tertiary"
                  size="xl"
                  block
                  class=""
                  @click="onCartOrderButtonClick" />
              </div>
            </div>
          </template>
        </HelperAsideGrid>
        <div class="my-6 rounded-lg border border-violet-200 bg-violet-100 p-4 shadow-lg">
          <p>
            Вы можете редактировать позиции в корзине, уменьшая и увеличивая их количество. Чтобы удалить товар,
            достаточно уменьшить его количество до нуля. Все требования к заказу, такие, как наличие поверки или
            калибровки, включение доставки в стоимость, требования к документации или упаковке, можно указать в
            комментарии. Реквизиты организации и другую относящуюся к заявке информацию можно прикрепить отдельным
            файлом.
          </p>
          <p>
            Нажмите «Оформить заказ» и заполните контактную информацию для продолжения покупки. После обработки заказа
            мы отправим счет на указанную электронную почту или свяжемся с Вами для уточнения деталей. Отгрузка по
            России осуществляется транспортными компаниями, забрать товар самостоятельно можно с нашего склада в
            Челябинске.
          </p>
        </div>
      </template>
      <div
        v-else
        class="mx-auto my-4 max-w-lg rounded-lg border border-violet-200 bg-violet-50 p-4">
        <h2 class="mb-4 border-b border-gray-200 text-lg font-bold">Заказ № {{ orderNumber }} успешно создан!</h2>
        <p class="">
          На почту <span class="text-primary">{{ user.mail }}</span> отправлено письмо, содержащее информацию по заказу.
        </p>
      </div>
    </div>
  </div>
</template>
