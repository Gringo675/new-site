<script setup>
//
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="m-4 text-5xl">
    <div>принимая во внимание, что пренебрежение и презрение к правам человека</div>
    <div>Штангенциркуль ШЦ-I-125-0,1 ЧИЗ</div>
  </div>
  <div id="container">
    <div class="el">ONE</div>
    <div class="el">TWO</div>
    <div class="el">THREE</div>
    <div class="el">FOUR</div>
    <!--   <div class="el">FIVE</div>
  <div class="el">SIX</div>
  <div class="el">SEVEN</div>
  <div class="el">EIGHT</div>
  <div class="el">NINE</div>
  <div class="el">TEN</div> -->
  </div>
</template>

<style>
#container {
  color: white;
  background-color: lightgray;
  font-family: sans-serif;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-flow: dense;
}

.el {
  padding: 1.5rem;
  background-color: dimgray;
  border: 1px darkgray solid;
}
</style>
