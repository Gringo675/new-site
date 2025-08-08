<script setup lang="ts"></script>

<template>
  <div class="mx-auto my-6 max-w-fit rounded-2xl bg-stone-900 p-4">
    <div class="animate-gradient font-accent bg-clip-text p-2 text-center text-2xl text-transparent lg:text-3xl">
      Точность измерений - фундамент Вашего успеха!
    </div>
    <div class="animate-gradient h-px w-full"></div>
    <ul class="font-accent list-inside list-disc p-2 text-right text-xl text-orange-200">
      <li>Измерительный инструмент и приборы</li>
      <li>Средства допускового контроля</li>
      <li>Поверка и калибровка</li>
    </ul>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  animation: gradient 8s linear infinite;
  background-image: linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40);
  background-size: 300% 100%;
}
</style>
