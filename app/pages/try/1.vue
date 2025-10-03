<script setup>
//
definePageMeta({
  layout: 'empty',
})

const toast = useToast()

function showToast() {
  toast.add({
    title: 'Мы используем куки и веб-аналитику',
    description: () =>
      h('span', [
        'Оставаясь с нами, вы соглашаетесь с ',
        h(
          'a',
          {
            href: '/privacy',
            class: 'underline text-tertiary whitespace-nowrap',
            target: '_blank',
          },
          'Политикой конфиденциальности',
        ),
      ]),
    icon: 'material-symbols-cookie-outline',
    progress: false,
    duration: 60 * 1000,
    actions: [
      {
        icon: 'i-heroicons-check',
        label: 'Принять',
        color: 'primary',
        variant: 'subtle',
        size: 'lg',
        class: 'px-10 mx-auto',
        onClick: e => {
          e?.stopPropagation()
        },
      },
    ],
  })
}
</script>

<template>
  <div class="h-200 w-200 max-w-full bg-amber-300 p-5">
    <UButton
      label="Show toast"
      color="neutral"
      variant="outline"
      @click="showToast" />
  </div>
</template>
