<script setup>

const write = () => {
  const cTime = new Date().toLocaleTimeString()
  cv(`from test1 time: ${cTime}`)
}

const someArray = [1, 2, 'some text', {val1: 444, val2: 'lalalala'}]

const someObject = {
  val1: 333,
  val2: 'www',
  val3: [2,3,5]
}

const someInt = 555

if (process.server) {
  // for (let i=0; i<10; i++) {
  //   write()
  // }
  cv({someArray}, {someObject}, {someInt})
  cv('just text')
  cv('some text', someObject)
}

const aaa = 111
</script>

<template>
  <button class="button" @click="write">write to cc</button>
</template>

