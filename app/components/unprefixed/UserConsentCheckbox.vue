<script setup>
//
const consentForm = useTemplateRef('consentForm')
const state = reactive({
  consent: false,
})
const validate = () =>
  state.consent ? [] : [{ name: 'consent', message: 'Для продолжения нам необходимо получить Ваше согласие' }]

const checkConsent = () => {
  consentForm.value.submit() // to show error message if not valid
  return state.consent
}
defineExpose({ checkConsent })

function onError(event) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <UForm
    ref="consentForm"
    :validate="validate"
    :state="state"
    @error="onError">
    <UFormField name="consent">
      <UCheckbox
        required
        v-model="state.consent"
        label="Политикой конфиденциальности"
        class="">
        <template #label>
          Подтверждаю
          <NuxtLink
            to="/consent"
            target="_blank"
            class="text-indigo-500 underline-offset-4 hover:underline"
            >Согласие</NuxtLink
          >
          на сбор и обработку моих персональных данных в соответствии с
          <NuxtLink
            to="/privacy"
            target="_blank"
            class="text-indigo-500 underline-offset-4 hover:underline"
            >Политикой конфиденциальности</NuxtLink
          >
        </template>
      </UCheckbox>
    </UFormField>
  </UForm>
</template>
