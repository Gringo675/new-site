<script setup>

const catsObj = reactive( {} )
catsObj.items = await useFetch('/api/getCategories')
catsObj.items = catsObj.items.data // более элегантного способа не придумал
catsObj.changedCats = {} // хранит информацию об изменениях в категориях
catsObj.handleChanges = function (parentIndex, childIndex, key, newContent) {
  const targetCat = (childIndex === null ? this.items[parentIndex] : this.items[parentIndex].children[childIndex])

  if (targetCat[key] !== newContent) { // есть изменения
    targetCat[key] = newContent
    if (this.changedCats[targetCat.id] === undefined) this.changedCats[targetCat.id] = {}
    this.changedCats[targetCat.id][key] = newContent

    console.log(`changedCats: ${JSON.stringify(this.changedCats)}`);
  }
}
catsObj.saveChanges = async function () {

  for (const key in this.changedCats) {
    const postData = {
      id: key,
      fields: this.changedCats[key]
    }
    console.log(`postData: ${JSON.stringify(postData)}`);
    const response = await $fetch('/api/setCategory', {
      method: 'POST',
      body: postData
    })
  }
}

const propersObj = reactive( {} )
propersObj.items = await useFetch('/api/getProperties')
propersObj.items = propersObj.items.data



</script>

<template>
  <div class="categories">
    <h1>Categories</h1>
    <button :disabled="!Object.keys(catsObj.changedCats).length" @click="catsObj.saveChanges()">
      Save
    </button>
    <div class="catItems">
      <template v-for="(parentCat, parentIndex) in catsObj.items" :key="parentCat.id">
        <AdminCatsItemBlock :parentIndex=parentIndex :childIndex=null :catsObj=catsObj :propersObj=propersObj />
<!--        <div>{{ parentCat.name }}</div>-->
      </template>
    </div>
 </div>
</template>

<style lang="scss">
.categories {

  .editableBlock {
    width: 250px;
    margin: 5px;
    padding: 5px;
    border: 1px solid blue;
    border-radius: 5px;
  }

  .parentCat {
    background: orchid;
    margin: 10px;
    padding: 10px;
    border-radius: 10px;

    .paramsBlock {
      display: flex;
    }

    .childrenBlock {

      .childCat {

      }
    }
  }
}
</style>