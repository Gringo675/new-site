<script setup>
//
</script>

<template>
  <div class="flex flex-none snap-center basis-full justify-center p-2">
    <img
      src="https://chelinstrument.ru/components/com_jshopping/files/img_products/shc-i-stiz_1.jpg"
      class="border border-blue-700 max-w-[150px] min-w-10 object-contain shrink"
      draggable="false"
    />
  </div>

  <div class="fcontainer">
    <div class="imgcontainer">
      <img
        class="fitem"
        src="https://chelinstrument.ru/components/com_jshopping/files/img_products/SHC1STIZ.jpg"
        alt=""
      />
    </div>

    <img
      class="fitem"
      src="https://chelinstrument.ru/components/com_jshopping/files/img_products/shc-i-stiz_2.jpg"
      alt=""
    />
    <img
      class="fitem"
      src="https://chelinstrument.ru/components/com_jshopping/files/img_products/shc-i-stiz_3.jpg"
      alt=""
    />
  </div>
</template>

<style>
.fcontainer {
  display: flex;
  width: 300px;
  background: red;
  overflow: auto;
  border: 1px solid black;
}
.fitem {
  max-width: 100px;
  min-width: 50px;
  flex-shrink: 1;
  border: 1px solid green;
}
</style>
