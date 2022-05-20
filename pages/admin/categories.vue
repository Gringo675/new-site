<script setup>

const {data: cats} = useCats()
// const {data: props} = useProps()
// console.log(`cats: ${JSON.stringify(cats)}`);

async function saveChanges(parentIndex, childIndex, key, newContent) {
  const targetCat = (childIndex === null ? cats.value[parentIndex] : cats.value[parentIndex].children[childIndex])

  if (targetCat[key] !== newContent) {
    targetCat[key] = newContent
    // const response = await $fetch('/api/setCategory', {
    //   method: 'post',
    //   body: {parentIndex, childIndex, key, newContent}
    // })

    console.log(`changed`);
  }
}

</script>

<template>
  <div class="categories">
    <h1>Categories</h1>
    <div class="catItems">
      <template v-for="(parentCat, parentIndex) in cats" :key="parentCat.id">
        <AdminCatsItemBlock :parentIndex=parentIndex :childIndex=null :saveChanges=saveChanges />
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