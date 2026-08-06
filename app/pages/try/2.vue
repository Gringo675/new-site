<script setup lang="ts">
const selectedOption = ref<string | null>(null) // null, 'option1', or 'option2'
const nodeVersion = ref<string | null>(null)

function toggleOption(option: string) {
  if (selectedOption.value === option) {
    selectedOption.value = null // Deselect if already selected
  } else {
    selectedOption.value = option // Select the new option
  }
}

async function getNodeJsVersion(): Promise<string> {
  try {
    const data = await $fetch<{ version: string }>('/api/node-version')
    nodeVersion.value = data.version
    return data.version
  } catch (error) {
    console.error('Failed to get Node.js version:', error)
    nodeVersion.value = 'Error fetching version'
    throw error
  }
}
</script>

<template>
  <div class="flex gap-2">
    <UButton
      :variant="selectedOption === 'option1' ? 'solid' : 'outline'"
      :color="selectedOption === 'option1' ? 'primary' : 'neutral'"
      @click="toggleOption('option1')">
      Option 1
    </UButton>

    <UButton
      :variant="selectedOption === 'option2' ? 'solid' : 'outline'"
      :color="selectedOption === 'option2' ? 'primary' : 'neutral'"
      @click="toggleOption('option2')">
      Option 2
    </UButton>
  </div>

  <p class="mt-4">Currently selectedd: {{ selectedOption === null ? 'Nothing' : selectedOption }}</p>

  <div>
    <UButton
      to="/admin/cms/aiCatDescription"
      label="Go to AI Category Description" />
  </div>
  <div>
    <UButton
      @click="
        () => {
          getNodeJsVersion()
        }
      "
      label="get node.js version" />
    <p
      v-if="nodeVersion"
      class="mt-2 text-sm">
      Node.js version:
      <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">{{ nodeVersion }}</code>
    </p>
  </div>
</template>
