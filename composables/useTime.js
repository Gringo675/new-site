export default () => {
    return useAsyncData('time', async () => {
        // console.log(`useNuxtData('time'): ${JSON.stringify(useNuxtData('time').data.value, null, 2)}`)
        const oldValue = useNuxtData('time').data.value
        if (oldValue) return oldValue
        await new Promise((resolve) => setTimeout(resolve, 3000))
        return new Date().getSeconds()
    }, {lazy: false})
}