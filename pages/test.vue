<script setup>

const catsObj = reactive( {} )
// catsObj.items = await $fetch('/api/getCategories')
catsObj.items = await useFetch('/api/getCategories')
catsObj.items = catsObj.items.data // более элегантного способа не придумал
catsObj.saveChanges = async (parentIndex, childIndex, key, newContent) => {
  const targetCat = (childIndex === null ? this.items[parentIndex] : this.items[parentIndex].children[childIndex])

  if (targetCat[key] !== newContent) {
    targetCat[key] = newContent
    // const response = await $fetch('/api/setCategory', {
    //   method: 'post',
    //   body: {parentIndex, childIndex, key, newContent}
    // })

    console.log(`changed`);
  }
}
console.log(`catsObj.items: ${JSON.stringify(catsObj.items)}`);
</script>

<template>
  <div class="test">
TEST

<!--    <template v-for="i in 10">-->
<!--      <TheTest />-->
<!--    </template>-->

  </div>
</template>

<style lang="scss">
.test {
}
</style>