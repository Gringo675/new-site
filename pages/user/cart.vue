<script setup>
//
useSeoMeta({
  title: 'Корзина',
})

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

const formState = reactive({
  message: '',
  files: null,
})

const formValidate = state => {
  const errors = []
  if (state.message.length > 10) errors.push({ path: 'message', message: 'Слишком длинное сообщение!' })

  const fileInput = document.getElementById('cart_file_input')
  // @ts-ignore
  checkFormFiles(fileInput.files, errors)

  return errors
}

function onFormError(event) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

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
  // @ts-ignore
  document.getElementById('up_form').requestSubmit() // чтобы гарантировано запустить валидацию
  if (!TheUserProfileData.isUserDataValid) return
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
    cart.length = 0 // clear cart
  }
}

// table block

const tableColumns = [
  { key: 'id', label: 'Код' },
  { key: 'name', label: 'Наименование' },
  { key: 'quantity', label: 'Количество' },
  { key: 'price', label: 'Цена*' },
]

const changeQuantity = async (row, quantity) => {
  if (quantity === 0) {
    const proceed = await confirmCartDelete()
    if (!proceed) return
  }
  row.quantity = quantity
}
const clearCart = async () => {
  const proceed = await confirmCartDelete()
  if (!proceed) return
  cart.length = 0
}
const selectedRows = ref([])
const deleteSelected = async () => {
  const proceed = await confirmCartDelete()
  if (!proceed) return
  selectedRows.value.forEach(row => (row.quantity = 0))
  selectedRows.value = []
}
const confirmCartDelete = () => {
  // return promise
  return showMessage({
    title: 'Подтвердите удаление',
    description: `Товар(-ы) будут удалены из корзины без возможности восстановления. Продолжить?`,
    isDialog: true,
  })
}

// end of table block
</script>

<template>
  <template v-if="orderHandler.step !== 4">
    <h1>Корзина</h1>
    <div v-if="!cart.length">Корзина пуста!</div>
    <div v-else>
      <div class="max-w-[800px] mx-auto my-4">
        <UTable
          v-model="selectedRows"
          :rows="cart"
          :columns="tableColumns"
          :ui="{
            wrapper: ' border border-gray-400 rounded-md',
            base: 'base',
            thead: 'bg-gray-100',
            th: {
              base: 'text-center border-x ',
            },
            tr: {
              base: 'hover:bg-gray-200',
              selected: 'font-bold',
            },
            td: {
              base: 'text-center border-x ',
            },
          }"
        >
          <template #name-data="{ row }">
            <div class="text-left">
              <NuxtLink
                :to="`/product/${row.alias}`"
                class="hover:text-blue-600 hover:underline underline-offset-4"
                >{{ row.name }}
              </NuxtLink>
            </div>
          </template>
          <template #quantity-data="{ row }">
            <div class="flex justify-center items-center gap-2">
              <UButton
                :icon="row.quantity === 1 ? 'i-heroicons-trash' : 'i-heroicons-minus-small-solid'"
                @click="changeQuantity(row, row.quantity - 1)"
                variant="outline"
                color="secondary"
              />
              <UInput
                v-model.lazy="row.quantity"
                type="number"
                min="1"
                inputClass="w-12 text-center"
              />
              <UButton
                icon="i-heroicons-plus-small-solid"
                @click="changeQuantity(row, row.quantity + 1)"
                variant="outline"
                color="secondary"
              />
            </div>
          </template>
          <template #price-data="{ row }"> {{ row.price.toLocaleString() + ' ₽' }}</template>
        </UTable>
        <div class="flex items-center">
          <UButton
            :disabled="selectedRows.length === 0"
            label="Удалить выбранные"
            variant="outline"
            color="secondary"
            @click="deleteSelected"
            class="m-2"
          />
          <UButton
            label="Очистить корзину"
            variant="outline"
            color="secondary"
            @click="clearCart"
          />
          <div class="ml-auto mr-2">
            Итого: {{ cart.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString() + ' ₽' }}
          </div>
        </div>
        <div class="flex justify-end">
          <div class="border-t border-gray-400 my-2 px-2">* Цены указаны в рублях РФ без учета НДС 20%.</div>
        </div>
      </div>

      <!-- attach comment and file -->
      <UForm
        :state="formState"
        :validate="formValidate"
        id="cart_form"
        @error="onFormError"
        @submit="createOrderStep2"
        class="max-w-sm mx-auto"
      >
        <UFormGroup
          name="message"
          label="Комментарии к заказу"
        >
          <UTextarea
            v-model="formState.message"
            placeholder="Можно указать здесь дополнительные требования к товару, например, наличие поверки."
            resize
            :rows="7"
            class="my-4"
          />
        </UFormGroup>
        <UFormGroup
          name="files"
          description="Можно прикрепить файл, например, реквизиты организации."
        >
          <UInput
            v-model="formState.files"
            type="file"
            multiple
            id="cart_file_input"
          />
        </UFormGroup>
      </UForm>

      <UContainer
        v-if="orderHandler.step === 1"
        class="max-w-sm flex justify-center my-4"
      >
        <UButton
          label="Оформить заказ"
          type="submit"
          form="cart_form"
          size="lg"
        />
      </UContainer>

      <UAlert
        v-else-if="orderHandler.step === 2"
        icon="i-heroicons-exclamation-triangle"
        color="secondary"
        variant="outline"
        title="Вы не вошли в аккаунт!"
        description="Выберете действие для продолжения оформления заказа."
        :actions="[
          {
            variant: 'solid',
            color: 'primary',
            label: 'Войти/зарегистрироваться',
            click: loginHandler,
          },
          { variant: 'outline', color: 'primary', label: 'Быстрый заказ без регистрации', click: fastOrderHandler },
        ]"
        class="max-w-lg mx-auto"
      />
      <UContainer
        v-else-if="orderHandler.step === 3"
        class="max-w-sm flex flex-col items-center space-y-4 my-4"
      >
        <TheUserProfile
          class="w-full"
          @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
          @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
          @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
        />
        <UButton
          label="Создать заказ"
          @click="sendOrder"
          size="xl"
        />
      </UContainer>
    </div>
  </template>
  <UAlert
    v-else
    icon="i-heroicons-check-circle"
    color="primary"
    variant="outline"
    :title="`Заказ ${orderHandler.orderNumber > 1 ? `№${orderHandler.orderNumber}` : ''} успешно создан!`"
    :description="`На почту ${user.mail} отправлено письмо, содержащее информацию по заказу.`"
    class="max-w-lg mx-auto"
  />
</template>
