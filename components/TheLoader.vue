<script setup>
//
</script>

<template>
  <UModal
    :close="false"
    :dismissible="false"
    :fullscreen="false"
    :ui="{ content: 'bg-transparent shadow-none ring-0 ' }"
    title="loading..."
    description="loading..."
  >
    <template #content>
      <HelperLoader />
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        viewBox="0 0 24 24"
      >
        <path
          class="fill-secondary-400"
          d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
        >
          <animateTransform
            attributeName="transform"
            dur="0.75s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
      </svg> -->
    </template>
  </UModal>
</template>
