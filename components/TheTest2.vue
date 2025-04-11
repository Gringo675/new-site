<script setup>
import { form } from '#build/ui'

//
const userProfile = useTemplateRef('userProfileRef')

const onTest = async () => {
  const { saveUserData } = userProfile.value
  const isSaved = await saveUserData()

  console.log(`isSaved: ${isSaved}`)
}

const formState = reactive({
  message: 'default',
  message2: '',
  files: null,
})
const fieldErrors = {
  message: '',
  message2: '',
  files: '',
}
const validateField = (field, value) => {
  console.log(`field: ${field}, value: ${value}`)
  switch (field) {
    case 'message':
      fieldErrors.message = value ? '' : 'Напишите сообщение!'
      break
    case 'message2':
      fieldErrors.message2 = value[0] === 'f' ? 'Should not start with f' : ''
      break
    case 'files':
      fieldErrors.files = checkFormFiles(value)
      break
  }
}
watch(
  () => formState.message,
  val => validateField('message', val),
)
watch(
  () => formState.message2,
  val => validateField('message2', val),
)
watch(
  () => formState.files,
  val => validateField('files', val),
)

const formValidate = () => {
  console.log(`from formValidate`)
  return Object.entries(fieldErrors)
    .filter(([_, message]) => message)
    .map(([name, message]) => ({ name, message }))
}

const onSubmit = event => {
  console.log(`outty submit: ${JSON.stringify(event.data, null, 2)}`)
}
function onError(event) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <div class="p-4">
    <UForm
      :validate="formValidate"
      :state="formState"
      @submit="onSubmit"
      @error="onError"
      class="space-y-4"
    >
      <UFormField
        label="Сообщение"
        name="message"
        required
      >
        <UInput v-model="formState.message" />
      </UFormField>
      <UFormField
        label="Сообщение"
        name="message2"
      >
        <UInput v-model="formState.message2" />
      </UFormField>
      <UFormField name="files">
        <UInput
          @change="formState.files = $event.target.files"
          type="file"
          multiple
        />
      </UFormField>
      <UButton type="submit">Сохранить</UButton>
    </UForm>
    <!-- <TheUserProfile ref="userProfileRef" /> -->
    <div class="p-2">
      <UButton
        label="Test"
        @click="onTest"
      />
    </div>
  </div>
</template>
