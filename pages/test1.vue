<script setup>
//
const cats = ref([
  {
    name: 'cat1',
    active: true,
  },
  {
    name: 'cat2',
    active: true,
  },
  {
    name: 'cat3',
    active: true,
  },
])
// console.log(`cats: ${JSON.stringify(cats, null, 2)}`)
watch(
  cats,
  () => {
    console.log(`cats changed`)
  },
  { deep: true }
)

const someObj = reactive({
  aaa: { name: 111 },
  bbb: { name: 222 },
  ccc: { name: 333 },
})
watch(someObj, () => {
  console.log(`obj changed`)
})

const someStr = ref('aaa')
// console.log(`someStr: ${JSON.stringify(someStr, null, 2)}`)
watch(someStr, () => {
  console.log(`str changed`)
})
</script>

<template>
  <div>
    <h2>Array</h2>
    <label
      v-for="cat of cats"
      class="block ml-2"
    >
      <input
        type="checkbox"
        v-model="cat.active"
      />
      {{ cat.name }}
    </label>
  </div>
  <div>
    <h2>Object</h2>
    <input
      v-for="key in someObj"
      type="text"
      v-model="key.name"
      class="block ml-2"
    />
  </div>
  <div>
    <h2>String</h2>
    <input
      type="text"
      v-model="someStr"
      class="block ml-2"
    />
  </div>
</template>
