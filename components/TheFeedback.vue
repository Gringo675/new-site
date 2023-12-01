<script setup>
//
const feedback = useFeedback()
const user = useUser().value
const message = ref('')
// @ts-ignore
const isMessage = computed(() => message.value.length > 15)

const TheUserProfileData = reactive({
  isUserDataChanged: false,
  isUserDataValid: false,
  saveUserData: () => {},
})

const sendMessage = async () => {
  if (TheUserProfileData.isUserDataChanged) {
    const isUserSaved = await TheUserProfileData.saveUserData()
    // @ts-ignore
    if (!isUserSaved) return
  }

  // @ts-ignore
  const fbForm = document.getElementById('fb_form') // message and files
  // @ts-ignore
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
</script>

<template>
  <!-- wrapper -->
  <UModal
    v-model="feedback.isActive"
    prevent-close
  >
    <UCard>
      <template #header>
        {{ feedback.title }}
      </template>
      <div class="">{{ feedback.description }}</div>
      <form id="fb_form">
        <textarea
          name="message"
          v-model="message"
          class="m-2 p-2 border-2 border-blue-300"
          placeholder="Сообщение"
          :class="{
            'border-green-400': isMessage,
            'border-yellow-300': !isMessage,
          }"
        ></textarea>
        <input
          name="files"
          type="file"
          multiple
          @change="checkFormFiles"
        />
      </form>
      <TheUserProfile
        @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
        @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
        @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
      />
      <template #footer>
        <div class="flex justify-end items-center gap-x-4">
          <UButton
            label="Отмена"
            variant="outline"
            color="secondary"
            @click="feedback.isActive = false"
          />
          <UButton
            label="Ok"
            color="secondary"
            class="px-8"
            @click=""
            :disabled="!TheUserProfileData.isUserDataValid || !isMessage"
          />
        </div>
      </template> </UCard
  ></UModal>
  <!-- <div
    class="modal-form w-[800px] max-w-[95%] max-h-[90vh] border border-slate-300 rounded-xl overflow-auto flex flex-col justify-start"
  >
    <div class="flex flex-row justify-between items-center bg-slate-300 p-2.5">
      <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">
        {{ feedbackData.title }}
      </div>
    </div>
    <div class="p-5 overflow-auto bg-slate-200">
      <form id="fb_form">
        <textarea
          name="message"
          v-model="message"
          class="m-2 p-2 border-2 border-blue-300"
          placeholder="Сообщение"
          :class="{
            'border-green-400': isMessage,
            'border-yellow-300': !isMessage,
          }"
        ></textarea>
        <input
          name="files"
          type="file"
          multiple
          @change="checkFormFiles"
        />
      </form>
      <TheUserProfile
        @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
        @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
        @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
      />
    </div>
    <div class="p-2.5 bg-zinc-400 flex justify-end items-center">
      <button
        class="button px-2 py-1"
        @click="closeFeedback"
      >
        Закрыть
      </button>
      <button
        @click="sendMessage"
        class="button"
        :disabled="!TheUserProfileData.isUserDataValid || !isMessage"
      >
        Отправить
      </button>
    </div>
  </div> -->
</template>
