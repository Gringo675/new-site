<script setup>
const siteStatus = ref(await myFetch('/api/admin/system/siteStatus', { method: 'post', payload: {} }))

// console.log(`siteStatus: ${JSON.stringify(!!Number(siteStatus), null, 2)}`)

const changeStatus = async () => {
  const newStatus = siteStatus.value === '0' ? '1' : '0'
  siteStatus.value = await myFetch('/api/admin/system/siteStatus', {
    method: 'post',
    payload: {
      setStatus: newStatus,
    },
  })
}
</script>

<template>
  <HelperAdminOnly>
    <div class="optons">
      <div>Сайт закрыт: {{ !!Number(siteStatus) }}</div>
      <button
        class="button"
        @click="changeStatus"
      >
        {{ Number(siteStatus) ? 'Открыть сайт' : 'Закрыть сайт' }}
      </button>
    </div>
  </HelperAdminOnly>
</template>
