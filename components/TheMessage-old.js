{
  /* <script setup>
//
const messageData = useMessageData()

const isDialogMessage = typeof messageData.callback === 'function'

const buttonHandler = response => {
  if (isDialogMessage && response) messageData.callback()
  closeMessage()
}
</script>

<template>
  <div
    class="modal-form w-96 max-w-[95%] max-h-[90vh] border border-amber-900 rounded-xl overflow-auto flex flex-col justify-start"
    :class="{ 'border-red-500': messageData.type === 'error', 'border-green-500': messageData.type === 'success' }"
  >
    <div
      class="flex flex-row justify-between items-center bg-orange-300 p-2.5"
      :class="{ 'bg-red-400': messageData.type === 'error', 'bg-green-400': messageData.type === 'success' }"
    >
      <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">
        {{ messageData.title }}
      </div>
    </div>
    <div class="p-5 overflow-auto bg-amber-100">
      <div v-html="messageData.body"></div>
    </div>
    <div class="p-2.5 bg-orange-200 flex justify-end items-center">
      <button
        v-if="isDialogMessage"
        @click="buttonHandler(false)"
        class="button px-2 py-1"
      >
        Cancel
      </button>
      <button
        @click="buttonHandler(true)"
        class="button px-2 py-1"
      >
        OK
      </button>
    </div>
  </div>
</template> */
}
