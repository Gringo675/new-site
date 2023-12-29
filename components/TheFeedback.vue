<script setup>
//
const feedback = useFeedback()
const user = useUser().value

const TheUserProfileData = reactive({
  isUserDataChanged: false,
  isUserDataValid: false,
  saveUserData: () => {},
})

const state = reactive({
  message: '',
  files: null,
})

const validate = state => {
  const errors = []
  if (state.message.length > 10000) errors.push({ path: 'message', message: 'Слишком длинное сообщение!' })
  if (!state.message.length) errors.push({ path: 'message', message: 'Напишите сообщение!' })

  const fileInput = document.getElementById('file_input')
  checkFormFiles(fileInput.files, errors)

  return errors
}

const onSubmit = async () => {
  document.getElementById('up_form').requestSubmit() // чтобы гарантировано запустить валидацию
  if (!TheUserProfileData.isUserDataValid) return
  if (TheUserProfileData.isUserDataChanged) {
    const isUserSaved = await TheUserProfileData.saveUserData()
    if (!isUserSaved) return
  }

  const fbForm = document.getElementById('fb_form')
  const formData = new FormData(fbForm)
  formData.append('user', JSON.stringify(user))

  const success = await myFetch('/api/user/sendFeedback', {
    method: 'post',
    payload: formData,
  })

  if (success) {
    showNotice({ title: 'Сообщение отправлено!', description: 'Вам ответят в ближайшее время.', type: 'success' })
    feedback.isActive = false
  }
}

function onError(event) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <UCard>
    <template #header>
      {{ feedback.title }}
    </template>
    <!-- columns -->
    <div class="grid grid-cols-2 gap-x-6">
      <!-- first col -->
      <div class="col-span-2 md:col-span-1">
        <div class="">{{ feedback.description }}</div>
        <UForm
          :state="state"
          :validate="validate"
          id="fb_form"
          @submit="onSubmit"
          @error="onError"
        >
          <UFormGroup name="message">
            <UTextarea
              v-model="state.message"
              placeholder="Ваше сообщение..."
              resize
              :rows="9"
              class="my-4"
            />
          </UFormGroup>
          <UFormGroup name="files">
            <UInput
              v-model="state.files"
              type="file"
              multiple
              id="file_input"
            />
          </UFormGroup>
        </UForm>
      </div>
      <!-- second col -->
      <div class="col-span-2 md:col-span-1">
        <TheUserProfile
          @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
          @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
          @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end items-center gap-x-4">
        <UButton
          label="Отмена"
          variant="outline"
          color="secondary"
          @click="feedback.isActive = false"
        />
        <UButton
          type="submit"
          form="fb_form"
          label="Ok"
          color="secondary"
          class="px-8"
        />
      </div>
    </template>
  </UCard>
</template>
