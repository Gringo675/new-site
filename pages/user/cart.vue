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
    clearCart()
  }
}

// table block

const tableColumns = [
  { key: 'id', label: 'Код' },
  { key: 'name', label: 'Наименование' },
  { key: 'quantity', label: 'Количество' },
  { key: 'price', label: 'Цена, р. без НДС' },
]

const selectedRows = ref([])
const deleteSelected = async () => {
  const proceed = await confirmCartDelete()
  if (!proceed) return
  selectedRows.value.forEach(row => {
    const index = cart.findIndex(product => product.id === row.id)
    changeCartQuantity(index, 0)
  })
  selectedRows.value = []
}

// end of table block
</script>

<template>
  <template v-if="orderHandler.step !== 4">
    <h1>Корзина</h1>
    <div v-if="!cart.length">Корзина пуста!</div>
    <div v-else>
      <!-- products wrapper -->
      <UTable
        v-model="selectedRows"
        :rows="cart"
        :columns="tableColumns"
      >
        <template #name-data="{ row }">
          <NuxtLink :to="`/product/${row.alias}`">{{ row.name }}</NuxtLink>
        </template>
      </UTable>
      <UButton
        :disabled="selectedRows.length === 0"
        label="Удалить выбранные"
        @click="deleteSelected"
        class="m-2"
      />
      <UButton
        label="Очистить корзину"
        @click="clearCart"
      />

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
