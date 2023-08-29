<script setup>
//
const emit = defineEmits(['setSum1', 'setSum2', 'setF1'])

const var1 = ref(1)
const var2 = ref(2)
const var3 = ref(3)
const var4 = 44
const sum1 = computed(() => var1.value + var2.value)
const sum2 = computed(() => var2.value + var3.value)

emit('setSum1', sum1)
emit('setSum2', sum2)

// watchEffect(() => {
//   console.log(`from watch`)
//   emit('setSum1', sum1)
//   emit('setSum2', sum2)
// })

const f1 = async () => {
  console.log(`var4: ${JSON.stringify(var4, null, 2)}`)
  console.log(`before`)
  await new Promise(resolve => setTimeout(resolve, 3000))
  console.log(`after`)
}
emit('setF1', f1)
</script>

<template>
  <div>
    <input
      type="number"
      v-model="var1"
    />
    <input
      type="number"
      v-model="var2"
    />
    <input
      type="number"
      v-model="var3"
    />
    <!-- <p>summ: {{ summ }}</p> -->
  </div>
</template>
