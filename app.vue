<script setup>
import TheHeader from "./components/TheHeader";
import TheFooter from "./components/TheFooter";
import TheMessage from "./components/TheMessage";
</script>

<template>
  <div>
    <TheHeader/>
    <NuxtPage/>
    <TheFooter/>
    <ClientOnly>
      <TheMessage/>
    </ClientOnly>
  </div>
</template>
