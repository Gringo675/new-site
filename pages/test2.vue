<script setup>
//
</script>

<template>
  <div class="test w-[1000px] h-[1000px] bg-red-300 m-2"></div>
</template>

<style>
.test {
  background-image: url('/img/bg-test2.png'), url('/img/bg-test2.png');
  background-size: 200px 100px;
  background-position:
    10px 10px,
    120px 120px;
  /* background-repeat: no-repeat; */
}
</style>
