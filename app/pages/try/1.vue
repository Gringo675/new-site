<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

import type { TabsItem } from '@nuxt/ui'

const items = ref<TabsItem[]>([
  {
    label: 'Account',
    value: 'account',
    icon: 'i-lucide-user',
  },
  {
    label: 'Password',
    value: 'password',
    icon: 'i-lucide-lock',
  },
  {
    label: 'Settings',
    value: 'settings',
    icon: 'i-lucide-settings',
  },
])
const activeTab = ref('password')
</script>

<template>
  <div class="content mb-8 h-300 bg-amber-400">
    <div v-show="activeTab === 'account'">
      <h2>Account is active</h2>
    </div>
    <div v-show="activeTab === 'password'">
      <h2>Password is active</h2>
    </div>
    <div v-show="activeTab === 'settings'">
      <h2>Settings is active</h2>
    </div>
  </div>

  <div class="fixed right-0 bottom-0 left-0 z-20 border-t border-gray-300 bg-gray-200">
    <UTabs
      v-model="activeTab"
      :content="false"
      :items="items"
      color="neutral"
      variant="link"
      size="xs"
      class="" />
  </div>
</template>
