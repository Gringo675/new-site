<script setup>
//
const items = reactive([111, 222, 333, 444])
</script>

<template>
  <h1>test2</h1>
  <div class="m-3">
    <UButton
      label="Add"
      @click="items.splice(1, 0, 555)"
    />
    <UButton
      label="Remove"
      @click="items.splice(0, 1)"
    />
  </div>
  <div class="m-3">
    <TransitionGroup name="list">
      <div
        v-for="item in items"
        :key="item"
        class="p-2 m-2 rounded bg-sky-200 w-32 text-center"
      >
        {{ item }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* .list-move,
.list-enter-active,
.list-leave-active {
  transition: all 5s ease;
} */
.list-enter-active,
.list-leave-active {
  transition: transform 2s ease !important;
}
.list-move {
  transition: transform 10s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 20;
  transform: translateX(200px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
