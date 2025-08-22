// export default async () => {
//   console.log(`from useTest`)
//   const testState = useState('test', () => {
//     return { data: null, pending: false }
//   })
//   if (testState.value.data) return testState.value.data
//   if (testState.value.pending) {
//     console.log(`pending...`)
//     return await new Promise(resolve => {
//       Object.defineProperty(testState.value, 'pending', {
//         set(value) {
//           console.log(`changed!!!`)
//           resolve(testState.value.data)
//         },
//       })
//       // setInterval(() => {
//       //   if (testState.value.data) resolve(testState.value.data)
//       //   else console.log(`no data...`)
//       // }, 0)
//     })
//   }

//   const initializer = async () => {
//     console.log(`from initializer`)
//     testState.value.pending = true
//     try {
//       testState.value.data = await $fetch('/api/apiTest')
//     } catch (e) {
//       testState.value.data = [] // fallback
//     }
//     testState.value.pending = false
//   }
//   await initializer()
//   return testState.value.data
// }

const helper = {
  pending: false,
  savedRequests: [],
}
export default async () => {
  console.log(`from useTest`)
  const testState = useState('test', () => null)
  // check if we have cached value
  if (testState.value) return testState.value

  // check if request going now
  if (helper.pending) {
    console.log(`pending...`)
    return await new Promise(resolve => {
      helper.savedRequests.push(resolve)
    })
  }
  // doing request
  console.log(`from initializer`)
  helper.pending = true
  try {
    testState.value = await $fetch('/api/apiTest')
  } catch (e) {
    testState.value = [] // fallback
  }
  helper.pending = false
  // handle saved requests
  if (helper.savedRequests.length) {
    console.log(`have saved requests`)
    for (const resolve of helper.savedRequests) resolve(testState.value)
    helper.savedRequests.length = 0
  }
  return testState.value
}

// export default async () => {
//   console.log(`from useTest`)
//   const testState = useState('test', () => {
//     return { data: null, pending: false }
//   })
//   if (testState.value.data) return testState.value.data
//   if (testState.value.pending) {
//     watch(
//       () => testState.value.pending,
//       () => {
//         console.log(`pending ended`)
//       }
//     )
//     return 'Pending...'
//   }

//   const initializer = async () => {
//     console.log(`from initializer`)
//     testState.value.pending = true
//     await new Promise(resolve => {
//       setTimeout(() => resolve('resolved'), 3000)
//     })
//     testState.value.pending = false
//     testState.value.data = 1111
//   }
//   await initializer()
//   return testState.value.data
// }

// export default async () => {
//   console.log(`from useTest`)
//   const key = 'test'
//   const { data: test } = useNuxtData(key)
//   if (test.value) {
//     return test
//   } else if (useState('testPending').value === true) {
//     console.log(`test pending`)
//   }
//   const { data } = await useAsyncData(key, async () => {
//     console.log(`from initializer`)
//     const pending = useState('testPending', () => true)
//     await new Promise(resolve => {
//       setTimeout(() => resolve('resolved'), 3000)
//     })
//     pending.value = false
//     return 1111
//   })
//   return data
// }
