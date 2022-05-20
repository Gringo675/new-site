<script setup>

</script>

<template>
  <div class="test">
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
.test {
}
</style>