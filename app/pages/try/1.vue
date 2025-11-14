<script setup>
//
const userForm = useTemplateRef('userFormRef')

const submitForm = async () => {
  const formData = await userForm.value.getUserFormData()
  // console.log(`formData: ${JSON.stringify(formData, null, 2)}`)
}
</script>

<template>
  <TheUserForm ref="userFormRef" />

  <div>
    <UButton @click="submitForm">OK</UButton>
  </div>
</template>
