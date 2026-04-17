<script setup lang="ts">
const selectedOption = ref<string | null>(null) // null, 'option1', or 'option2'

function toggleOption(option: string) {
  if (selectedOption.value === option) {
    selectedOption.value = null // Deselect if already selected
  } else {
    selectedOption.value = option // Select the new option
  }
}
</script>

<template>
  <div class="flex gap-2">
    <UButton
      :variant="selectedOption === 'option1' ? 'solid' : 'outline'"
      :color="selectedOption === 'option1' ? 'primary' : 'neutral'"
      @click="toggleOption('option1')"
    >
      Option 1
    </UButton>

    <UButton
      :variant="selectedOption === 'option2' ? 'solid' : 'outline'"
      :color="selectedOption === 'option2' ? 'primary' : 'neutral'"
      @click="toggleOption('option2')"
    >
      Option 2
    </UButton>
  </div>

  <p class="mt-4">
    Currently selected: {{ selectedOption === null ? 'Nothing' : selectedOption }}
  </p>
</template>
