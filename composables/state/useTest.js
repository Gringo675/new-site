export default async () => {
  console.log(`from useTest`)
  const key = 'test'
  const { data: test } = useNuxtData(key)
  if (test.value) {
    return test
  }
  const { data } = await useAsyncData(key, async () => {
    console.log(`from initializer`)
    await new Promise(resolve => {
      setTimeout(() => resolve('resolved'), 3000)
    })
    return 1111
  })
  return data
}
