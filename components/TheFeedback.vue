<script setup>
//
const props = defineProps({
  title: String,
  description: String,
})
const emit = defineEmits(['close'])

const userProfile = useTemplateRef('userProfileRef')

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
      fieldErrors.message = value ? '' : 'Напишите сообщение!'
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

const onSubmit = async () => {
  const isUserSaved = await userProfile.value.saveUserData()
  if (!isUserSaved) return

  const user = useUser().value

  const formData = new FormData()
  formData.append(
    'user',
    JSON.stringify({
      name: user.name,
      mail: user.mail,
      org: user.org,
      inn: user.inn,
      address: user.address,
      phone: user.phone,
    }),
  )
  formData.append('message', formState.message)
  if (formState.files) {
    Array.from(formState.files).forEach(file => {
      formData.append('files', file)
    })
  }

  const success = await myFetch('/api/user/sendFeedback', {
    method: 'post',
    payload: formData,
  })

  if (success) {
    showNotice({ title: 'Сообщение отправлено!', description: 'Вам ответят в ближайшее время.', type: 'success' })
    emit('close')
  }
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
  <UModal
    :title="title"
    :description="description"
    :dismissible="false"
    :ui="{
      content: 'max-w-2xl',
      header: 'min-h-auto',
    }"
  >
    <template #body>
      <div class="grid gap-x-6 gap-y-4 md:grid-cols-2">
        <!-- first col -->
        <div class="">
          <UForm
            :state="formState"
            :validate="formValidate"
            id="fb_form"
            @submit="onSubmit"
            @error="onError"
            class="space-y-4"
          >
            <UFormField
              name="message"
              label="Сообщение"
              required
            >
              <UTextarea
                v-model="formState.message"
                placeholder="Ваше сообщение..."
                resize
                :rows="9"
                class="w-full"
              />
            </UFormField>
            <UFormField
              name="files"
              label="Прикрепить файлы"
            >
              <UInput
                type="file"
                multiple
                @change="formState.files = $event.target.files"
              />
            </UFormField>
          </UForm>
        </div>
        <!-- second col -->
        <div class="">
          <TheUserProfile ref="userProfileRef" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-x-4">
        <UButton
          label="Отмена"
          variant="outline"
          color="neutral"
          @click="emit('close')"
        />
        <UButton
          type="submit"
          form="fb_form"
          label="Ok"
          variant="subtle"
          color="neutral"
          class="px-8"
        />
      </div>
    </template>
  </UModal>
</template>
