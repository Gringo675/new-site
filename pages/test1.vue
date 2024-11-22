<script setup>
//
const items = reactive([
  { name: 'чехол', id: 11, filtered: true },
  { name: 'корпус', id: 22, filtered: true },
  { name: 'кронштейн', id: 33, filtered: true },
  { name: 'кодсветка', id: 44, filtered: true },
])

const filter = ref('')
watch(filter, () => {
  for (const item of items) {
    item.filtered = item.name.toLowerCase().includes(filter.value.toLowerCase())
  }
})
// const filteredItems = computed(() => items.filter(item => item.name.toLowerCase().includes(filter.value.toLowerCase())))
</script>

<template>
  <h2>Test1</h2>
  <div>
    <UInput v-model="filter" />
  </div>
  <div class="m-3 relative">
    <TransitionGroup name="list">
      <template
        v-for="item in items"
        :key="item.id"
      >
        <div
          v-if="item.filtered"
          class="p-2 m-2 rounded bg-sky-200 w-32 text-center"
        >
          {{ item.name }}
        </div>
      </template>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 10s ease;
}
/* .list-enter-active,
.list-leave-active {
  transition: transform 2s ease;
}
.list-move {
  transition: transform 10s ease;
} */

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.1);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
