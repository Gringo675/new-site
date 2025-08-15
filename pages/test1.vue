<script setup>
//
const state = reactive({
  email: undefined,
})

const validate = state => {
  console.log('from validate')

  const errors = []
  if (state.email.length < 4) errors.push({ name: 'email', message: 'Required' })
  return errors
}

const toast = useToast()
async function onSubmit(event) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log('from submit')
}
</script>

<template>
  <div class="m-10">
    <!-- <UForm
      :validate="validate"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"> -->
    <UFormField
      label="Email"
      name="email">
      <UInput
        v-model="state.email"
        @keyup.enter="console.log('Enter key pressed')" />
    </UFormField>

    <UButton type="submit"> Submit </UButton>
    <!-- </UForm> -->
  </div>
</template>
