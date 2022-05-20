<script setup>

const props = defineProps({
  parentIndex: Number,
  childIndex: Number,
  saveChanges: Function
})

const {data: cats} = useCats()
const {data: catProps} =  useProps()
const cat = (props.childIndex !== null ? cats.value[props.parentIndex].children[props.childIndex] : cats.value[props.parentIndex])
// console.log(`parentIndex: ${props.parentIndex} childIndex: ${props.childIndex} cat.children.length: ${cat.children?.length}`);
console.log(`catProps.length: ${catProps.value?.length}`);
</script>

<template>
  <div class="catWrapper">
    <div class="catItem">

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.saveChanges(parentIndex, childIndex, 'name', $event.target.innerHTML)">
          {{ cat.name }}
        </div>
      </div>

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.saveChanges(parentIndex, childIndex, 'alias', $event.target.innerHTML)">
          {{ cat.alias }}
        </div>
      </div>

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.saveChanges(parentIndex, childIndex, 'image', $event.target.innerHTML)">
          {{ cat.image }}
        </div>
      </div>

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.saveChanges(parentIndex, childIndex, 'short_description', $event.target.innerHTML)">
          {{ cat.short_description }}
        </div>
      </div>

<!--      <div class="propWrapper">-->
<!--        <div class="editableBlock" contenteditable="true"-->
<!--             @blur="props.saveChanges(parentIndex, childIndex, 'description', $event.target.innerHTML)">-->
<!--          {{ cat.description }}-->
<!--        </div>-->
<!--      </div>-->

      <div class="propWrapper">
        <select @change="saveChanges(parentIndex, childIndex, 'p0_brand', $event.target.value)">
          <option disabled :selected="cat.p0_brand===0">Бренд:</option>
<!--          <option v-for="prop in catProps.filter( prop => prop.group_id === 0)" :value="prop.id"-->
<!--                  :selected="prop.id===cat.p0_brand">-->
<!--            {{ prop.name }}-->
<!--          </option>-->
        </select>
      </div>


    </div>
    <div class="catChildrenBlock" v-if="cat.children?.length">
      <template v-for="(childCat, childIndex) in cat.children" :key="childCat.id">
        <AdminCatsItemBlock :parentIndex=props.parentIndex :childIndex=childIndex :saveChanges=props.saveChanges />
      </template>
    </div>
  </div>

</template>

<style lang="scss">
.AdminCatsParamsBlock {
}
</style>