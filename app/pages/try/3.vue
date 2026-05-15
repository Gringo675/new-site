<script setup>
const items = ref([1, 2, 3])
const container = ref(null)
const log = ref([])

function addLog(msg) {
  log.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

function triggerError() {
  if (!container.value) return

  // Find the first item in the list
  const firstItem = container.value.querySelector('.list-item')

  if (firstItem) {
    // Move the item to the body.
    // This keeps the node existing but removes it from the parent.
    document.body.appendChild(firstItem)
    addLog('✅ First item moved to document.body. Now add a new item to trigger the error.')
  } else {
    addLog('❌ No list items found. Try refreshing.')
  }
}

function addItem() {
  // Adding an item to the beginning of the array forces Vue to
  // try to insert a new node before the first existing node.
  items.value.unshift(Date.now())
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-10">
    <h1 class="mb-4 text-2xl font-bold">insertBefore Error Test Ground</h1>
    <p class="mb-6 text-gray-600">
      This page attempts to trigger a real
      <code>NotFoundError</code>
      that bubbles up to
      <code>app/error.vue</code>
      .
    </p>

    <div class="mb-10 flex flex-wrap gap-4">
      <UButton
        label="1. Break DOM"
        @click="triggerError"
        color="orange"
        variant="outline" />
      <UButton
        label="2. Trigger Vue Update"
        @click="addItem"
        color="primary" />
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h2 class="mb-2 font-semibold">DOM Target:</h2>
        <div
          ref="container"
          class="min-h-[100px] border-2 border-dashed border-gray-300 bg-gray-50 p-4">
          <p class="mb-2 text-sm text-gray-500">Parent Container</p>
          <div
            v-for="item in items"
            :key="item"
            class="mb-2 list-item rounded bg-blue-100 p-2 text-blue-800 shadow-sm">
            Item {{ item }}
          </div>
        </div>
      </div>

      <div>
        <h2 class="mb-2 font-semibold">Event Log:</h2>
        <div class="h-48 overflow-y-auto rounded bg-black p-4 font-mono text-xs text-green-400">
          <div
            v-for="(msg, i) in log"
            :key="i"
            class="mb-1">
            {{ msg }}
          </div>
          <div
            v-if="!log.length"
            class="text-gray-500">
            No events yet...
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-700">
      <strong>How to use:</strong>
      <ol class="mt-2 ml-5 list-decimal space-y-1">
        <li>
          Click
          <b>"Break DOM"</b>
          . This moves the first list item to the body, leaving Vue's internal map out of sync with the actual DOM.
        </li>
        <li>
          Click
          <b>"Trigger Vue Update"</b>
          . Vue will try to insert a new item before the first item. Since that item is no longer a child of the container, the browser will throw the
          <code>NotFoundError</code>
          .
        </li>
      </ol>
    </div>
  </div>
</template>
