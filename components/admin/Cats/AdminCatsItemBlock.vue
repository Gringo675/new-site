<script setup>

const props = defineProps({
  parentIndex: Number,
  childIndex: Number,
  catsObj: Object,
  propersObj: Object
})

const cat = (props.childIndex !== null ? props.catsObj.items[props.parentIndex].children[props.childIndex] : props.catsObj.items[props.parentIndex])
const propers = props.propersObj.items

</script>

<template>
  <div class="catWrapper">
    <div class="catItem">

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.catsObj.handleChanges(parentIndex, childIndex, 'name', $event.target.innerHTML)">
          {{ cat.name }}
        </div>
      </div>

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.catsObj.handleChanges(parentIndex, childIndex, 'alias', $event.target.innerHTML)">
          {{ cat.alias }}
        </div>
      </div>

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.catsObj.handleChanges(parentIndex, childIndex, 'image', $event.target.innerHTML)">
          {{ cat.image }}
        </div>
      </div>

      <div class="propWrapper">
        <div class="editableBlock" contenteditable="true"
             @blur="props.catsObj.handleChanges(parentIndex, childIndex, 'short_description', $event.target.innerHTML)">
          {{ cat.short_description }}
        </div>
      </div>

      <!--      <div class="propWrapper">-->
      <!--        <div class="editableBlock" contenteditable="true"-->
      <!--             @blur="props.handleChanges(parentIndex, childIndex, 'description', $event.target.innerHTML)">-->
      <!--          {{ cat.description }}-->
      <!--        </div>-->
      <!--      </div>-->

      <div class="propWrapper">
        <select @change="props.catsObj.handleChanges(parentIndex, childIndex, 'p0_brand', $event.target.value)">
          <option disabled :selected="cat.p0_brand===0">Бренд:</option>
          <option v-for="proper in propers.brand" :value="proper.id"
                  :selected="proper.id===cat.p0_brand">
            {{ proper.name }}
          </option>
        </select>
      </div>

      <div class="propWrapper">
        <select @change="props.catsObj.handleChanges(parentIndex, childIndex, 'p1_type', $event.target.value)">
          <option disabled :selected="cat.p1_type===0">Тип:</option>
          <option v-for="proper in propers.type" :value="proper.id"
                  :selected="proper.id===cat.p1_type">
            {{ proper.name }}
          </option>
        </select>
      </div>

      <div class="propWrapper">
        <select @change="props.catsObj.handleChanges(parentIndex, childIndex, 'p2_counting_system', $event.target.value)">
          <option disabled :selected="cat.p2_counting_system===0">Система отсчета:</option>
          <option v-for="proper in propers.type" :value="proper.id"
                  :selected="proper.id===cat.p2_counting_system">
            {{ proper.name }}
          </option>
        </select>
      </div>


    </div>
    <div class="catChildrenBlock" v-if="cat.children?.length">
      <template v-for="(childCat, childIndex) in cat.children" :key="childCat.id">
        <AdminCatsItemBlock :parentIndex=parentIndex :childIndex=childIndex
                            :catsObj=catsObj :propersObj="propersObj"/>
      </template>
    </div>
  </div>

</template>

<style lang="scss">
.AdminCatsParamsBlock {
}
</style>