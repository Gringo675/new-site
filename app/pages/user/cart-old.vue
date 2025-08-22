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
    },
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
const UCheckbox = resolveComponent('UCheckbox')
const tableColumns = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': value => row.toggleSelected(!!value),
        'aria-label': 'Select row',
      }),
  },
  { accessorKey: 'id', header: 'Код' },
  { accessorKey: 'name', header: 'Наименование', meta: { class: { td: 'whitespace-normal' } } },
  { accessorKey: 'quantity', header: 'Количество' },
  { accessorKey: 'price', header: 'Цена*', meta: { class: { td: 'text-right' } } },
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
const selectedRows = ref({})
const deleteSelected = async () => {
  const proceed = await confirmCartDelete()
  if (!proceed) return
  // selectedRows.value.forEach(row => (row.quantity = 0))
  Object.keys(selectedRows.value).forEach(index => (cart[index].quantity = 0))
  selectedRows.value = {}
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
  <div class="">
    <template v-if="orderHandler.step !== 4">
      <div
        v-if="!cart.length"
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
      <template v-else>
        <h1 class="font-accent my-4 text-2xl">Корзина</h1>
        <div class="mx-auto my-4 max-w-(--breakpoint-md)">
          <UTable
            :data="cart"
            :columns="tableColumns"
            v-model:row-selection="selectedRows"
            class="rounded-md border border-violet-400"
            :ui="{
              th: 'text-center',
              thead: 'bg-gray-100',
            }"
          >
            <template #name-cell="{ row }">
              <NuxtLink
                :to="`/product/${row.original.alias}`"
                class="text-indigo-500 underline-offset-4 hover:underline"
                >{{ row.original.name }}
              </NuxtLink>
            </template>
            <template #quantity-cell="{ row }">
              <div class="flex items-center justify-center gap-2">
                <UButton
                  color="secondary"
                  :icon="row.original.quantity === 1 ? 'i-heroicons-trash' : 'i-heroicons-minus-small-solid'"
                  @click="changeQuantity(row.original, row.original.quantity - 1)"
                  variant="outline"
                />
                <UInput
                  color="secondary"
                  v-model.lazy="row.original.quantity"
                  type="number"
                  min="1"
                  :ui="{
                    base: 'text-center w-12',
                  }"
                />
                <UButton
                  color="secondary"
                  icon="i-heroicons-plus-small-solid"
                  @click="changeQuantity(row.original, row.original.quantity + 1)"
                  variant="outline"
                />
              </div>
            </template>
            <template #price-cell="{ row }"> {{ row.original.price.toLocaleString() + ' ₽' }}</template>
          </UTable>
          <!-- <UTable
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
                class="underline-offset-4 hover:text-blue-600 hover:underline"
                >{{ row.name }}
              </NuxtLink>
            </div>
          </template>
          <template #quantity-data="{ row }">
            <div class="flex items-center justify-center gap-2">
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
        </UTable> -->
          <div class="flex items-center">
            <UButton
              :disabled="Object.keys(selectedRows).length === 0"
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
            <div class="mr-2 ml-auto">
              Итого: {{ cart.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString() + ' ₽' }}
            </div>
          </div>
          <div class="flex justify-end">
            <div class="my-2 border-t border-gray-400 px-2">* Цены указаны в рублях РФ без учета НДС 20%.</div>
          </div>
        </div>

        <!-- attach comment and file -->
        <UForm
          :state="formState"
          :validate="formValidate"
          id="cart_form"
          @error="onFormError"
          @submit="createOrderStep2"
          class="mx-auto max-w-sm"
        >
          <UFormField
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
          </UFormField>
          <UFormField
            name="files"
            description="Можно прикрепить файл, например, реквизиты организации."
          >
            <UInput
              v-model="formState.files"
              type="file"
              multiple
              id="cart_file_input"
            />
          </UFormField>
        </UForm>

        <UContainer
          v-if="orderHandler.step === 1"
          class="my-4 flex max-w-sm justify-center"
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
          class="mx-auto max-w-lg"
        />
        <UContainer
          v-else-if="orderHandler.step === 3"
          class="my-4 flex max-w-sm flex-col items-center space-y-4"
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
      </template>
    </template>
    <UAlert
      v-else
      icon="i-heroicons-check-circle"
      color="primary"
      variant="outline"
      :title="`Заказ ${orderHandler.orderNumber > 1 ? `№${orderHandler.orderNumber}` : ''} успешно создан!`"
      :description="`На почту ${user.mail} отправлено письмо, содержащее информацию по заказу.`"
      class="mx-auto max-w-lg"
    />
  </div>
</template>
