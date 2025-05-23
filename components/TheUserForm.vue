<script setup>
//
/**
 * Форма для ввода сообщения пользователя и прикрепления файлов.
 * Используется в компоненте обратной связи и в корзине.
 * Передает наружу функцию getUserFormData, которая возвращает данные формы.
 */

const props = defineProps({
  forCart: {
    type: Boolean,
    default: false,
  },
})
const userFormRef = useTemplateRef('userFormRef')
defineExpose({ userFormRef, getUserFormData })

const formState = reactive({
  message: '',
  files: null,
})
const fieldErrors = {
  message: '',
  files: '',
}
const validateField = (field, value) => {
  switch (field) {
    case 'message':
      fieldErrors.message = props.forCart || value ? '' : 'Напишите сообщение!'
      break
    case 'files':
      fieldErrors.files = checkFormFiles(value)
      break
  }
}
watch(
  () => formState.message,
  val => validateField('message', val),
  { immediate: true },
)
watch(
  () => formState.files,
  val => validateField('files', val),
  { immediate: true },
)

const formValidate = () => {
  return Object.entries(fieldErrors)
    .filter(([_, message]) => message)
    .map(([name, message]) => ({ name, message }))
}

function onError(event) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function getUserFormData() {
  const isValid = await userFormRef.value.validate().catch(() => false) // если есть ошибки, выбрасывает ошибку
  if (!isValid) {
    userFormRef.value.submit() // для запуска onError
    return false
  }

  const formData = new FormData()
  formData.append('message', formState.message)
  if (formState.files) {
    Array.from(formState.files).forEach(file => {
      formData.append('files', file)
    })
  }
  return formData
}
</script>

<template>
  <UForm
    :state="formState"
    :validate="formValidate"
    ref="userFormRef"
    @error="onError"
    class="flex w-full flex-wrap gap-4"
    :class="forCart && 'justify-evenly'"
  >
    <UFormField
      name="message"
      :label="forCart ? 'Комментарий к заказу' : 'Сообщение'"
      :required="!forCart"
      :class="forCart ? 'w-80' : 'w-full'"
    >
      <UTextarea
        v-model="formState.message"
        :placeholder="
          forCart
            ? 'Можно указать здесь дополнительные требования к товару, например, наличие поверки.'
            : 'Ваше сообщение...'
        "
        resize
        :rows="forCart ? 4 : 9"
        class="w-full"
      />
    </UFormField>
    <UFormField
      name="files"
      label="Прикрепить файлы"
      description="Можно прикрепить файл, например, реквизиты организации."
      :class="forCart && 'max-w-75'"
    >
      <UInput
        type="file"
        multiple
        @change="formState.files = $event.target.files"
      />
    </UFormField>
  </UForm>
</template>
