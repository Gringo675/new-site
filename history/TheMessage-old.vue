<script setup>
//
const message = useMessage()

const resolveHandler = answer => {
  message.resolve(answer)
  message.active = false
}

const test = () => {
  throw new Error('manual error')
  // const aaa = bbb - 2
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
          v-if="!message.resolve"
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
      v-if="message.resolve"
    >
      <div class="flex items-center justify-end gap-x-4">
        <UButton
          label="Отмена"
          variant="outline"
          color="secondary"
          @click="resolveHandler(false)"
        />
        <UButton
          label="Ok"
          color="secondary"
          class="px-8"
          @click="resolveHandler(true)"
        />
      </div>
    </template>
  </UCard>
</template>
