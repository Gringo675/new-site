<script setup>
//
const props = defineProps({
  title: String,
  description: String,
  message: String,
})
const emit = defineEmits(['close'])

const userProfile = useTemplateRef('userProfileRef')
const userForm = useTemplateRef('userFormRef')

const submitForm = async () => {
  const formData = await userForm.value.getUserFormData()
  if (!formData) return

  const isUserSaved = await userProfile.value.saveUserData()
  if (!isUserSaved) return

  const user = useUser().value
  formData.append('subject', 'Сообщение с сайта - ' + props.title)
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

  const success = await myFetch('/api/user/sendFeedback', {
    method: 'post',
    payload: formData,
  })

  if (success) {
    showNotice({ title: 'Сообщение отправлено!', description: 'Вам ответят в ближайшее время.', type: 'success' })
    emit('close')
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
    }">
    <template #body>
      <div class="grid gap-x-6 gap-y-4 md:grid-cols-2">
        <!-- first col -->
        <div class="">
          <TheUserForm
            ref="userFormRef"
            :message="message" />
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
          @click="emit('close')" />
        <UButton
          label="Ok"
          @click="submitForm"
          variant="subtle"
          color="neutral"
          class="px-8" />
      </div>
    </template>
  </UModal>
</template>
