<script setup></script>

<template>
  <div class="flex h-screen flex-col">
    <header class="flex items-center justify-between bg-gray-800 p-2">
      <NuxtLink
        to="/"
        class="">
        <img
          src="/img/logo.svg"
          alt="logo"
          class="w-8 invert filter" />
      </NuxtLink>
      <NuxtLink
        to="/admin"
        class="text-lg text-white underline-offset-4 hover:underline"
        >Admin panel</NuxtLink
      >
      <div class="w-10"></div>
    </header>
    <main class="mx-auto w-full grow overflow-y-auto bg-gray-50 p-2">
      <slot />
    </main>
  </div>
</template>
