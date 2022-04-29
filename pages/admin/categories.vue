<script setup>
// const [rowCats, props] = await Promise.all([$fetch('/api/getCategories'), $fetch('/api/getProperties')])

import AdminCatsParamsBlock from "../../components/admin/Cats/AdminCatsParamsBlock";

const cats = useCats()
if (!cats.value.length) cats.value = await getCats()


const props = useProps()
if (!props.value.length) props.value = await getProps()


async function saveChanges(parentIndex, childIndex, key, newContent) {

  const targetCat = (childIndex === undefined ? cats[parentIndex] : cats[parentIndex].children[childIndex])

  if (targetCat[key] !== newContent) {
    targetCat[key] = newContent
    // const response = await $fetch('/api/setCategory', {
    //   method: 'post',
    //   body: {parentIndex, childIndex, key, newContent}
    // })

    console.log(`changed`);
  }
}

// TEST
// const { data: counter } = await useAsyncData('counter', () => someAsyncFunc())
const { data: counter } = await useAsyncData('counter', async () => {
  const result = await someAsyncFunc()
  return result
})
async function someAsyncFunc() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(777), 3000)
  });

  return await promise;
}

</script>

<template>
  <div class="categories">
    <div>
      TEST <br>
      counter: {{ counter }} <br>
      <div>
        <AdminCatsParamsBlock />
      </div>
    </div>
    <h1>Categories</h1>
    <div v-for="(parentCat, parentIndex) in cats" :key="parentCat.id" class="parentCat">
      <div class="paramsBlock">
        <div class="editableBlock" contenteditable="true"
             @blur="saveChanges(parentIndex, undefined, 'name', $event.target.innerHTML)">
          {{ parentCat.name }}
        </div>
        <div class="editableBlock" contenteditable="true"
             @blur="saveChanges(parentIndex, undefined, 'alias', $event.target.innerHTML)">
          {{ parentCat.alias }}
        </div>
        <div class="editableBlock" contenteditable="true"
             @blur="saveChanges(parentIndex, undefined, 'image', $event.target.innerHTML)">
          {{ parentCat.image }}
        </div>
      </div>
      <div class="childrenBlock">
        <div v-for="(childCat, childIndex) in parentCat.children" :key="childCat.id" draggable="true" class="childCat">
          <h3 contenteditable="true"
              @blur="saveChanges(parentIndex, childIndex, 'name', $event.target.innerHTML)">
            {{ childCat.name }}
          </h3>
          <!--        <div contenteditable="true">-->
          <!--          {{ childCat.description }}-->
          <!--        </div>-->
          <div>
            <select @change="saveChanges(parentIndex, childIndex, 'p0_brand', $event.target.value)">
              <option disabled :selected="childCat.p0_brand===0">Бренд:</option>
              <option v-for="prop in props.filter(prop => prop.group_id === 0)" :value="prop.id"
                      :selected="prop.id===childCat.p0_brand">
                {{ prop.name }}
              </option>
            </select>
            <select @change="saveChanges(parentIndex, childIndex, 'p1_type', $event.target.value)">
              <option disabled :selected="childCat.p1_type===0">Тип:</option>
              <option v-for="prop in props.filter(prop => prop.group_id === 1)" :value="prop.id"
                      :selected="prop.id===childCat.p1_type">
                {{ prop.name }}
              </option>
            </select>
            <select @change="saveChanges(parentIndex, childIndex, 'p2_counting_system', $event.target.value)">
              <option disabled :selected="childCat.p2_counting_system===0">Система отсчета:</option>
              <option v-for="prop in props.filter(prop => prop.group_id === 2)" :value="prop.id"
                      :selected="prop.id===childCat.p2_counting_system">
                {{ prop.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

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