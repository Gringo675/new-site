<script setup>
//
const message = useMessage()

const okHandler = () => {
  message.callback()
  message.active = false
}
</script>

<template>
  <UCard
    :ui="{
      header: {
        background:
          message.type === 'error' ? 'bg-red-200' : message.type === 'success' ? 'bg-green-200' : 'bg-secondary-200',
      },
    }"
  >
    <template #header>
      <div class="flex items-center justify-between gap-x-2">
        <h3 class="font-semibold">
          {{ message.title }}
        </h3>
        <UButton
          v-if="!message.callback"
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="message.active = false"
        />
      </div>
    </template>
    <div
      class=""
      v-html="message.description"
    ></div>

    <template
      #footer
      v-if="message.callback"
    >
      <div class="flex justify-end items-center gap-x-4">
        <UButton
          label="test"
          variant="outline"
          color="secondary"
          @click="showLoader()"
        />
        <UButton
          label="Отмена"
          variant="outline"
          color="secondary"
          @click="message.active = false"
        />
        <UButton
          label="Ok"
          color="secondary"
          class="px-8"
          @click="okHandler"
        />
      </div>
    </template>
  </UCard>
</template>
