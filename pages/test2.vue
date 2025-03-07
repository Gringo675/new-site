<script setup>
//
</script>

<template>
  <div class="container m-2 w-[600px] max-w-full bg-blue-200 p-2">
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
    <div class="item">some some some</div>
  </div>
</template>

<style>
.container {
  display: grid;
  /* grid-template-columns: repeat(auto-fit, minmax(150px, min-content)); */
  grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
}

.item {
  @apply whitespace-nowrap border border-gray-200 p-2;
}
</style>
