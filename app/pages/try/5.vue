<script setup>
useTitle('Test Sound | Try')

function handleTestSound() {
  playNotificationSound()
  showNotice({
    title: 'Звук воспроизведен!',
    description: 'Тестовый сигнал отправлен через Web Audio API.',
    type: 'success',
  })
}
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6 p-8 text-center">
    <h1 class="text-2xl font-bold">Тест звукового уведомления</h1>
    <p class="text-gray-600">Нажмите на кнопку ниже, чтобы протестировать звук завершения генерации.</p>
    
    <div class="pt-4">
      <UButton
        icon="i-lucide-volume-2"
        size="lg"
        color="primary"
        label="Воспроизвести тестовый звук"
        @click="handleTestSound" />
    </div>
  </div>
</template>
