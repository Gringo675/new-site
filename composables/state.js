
export const useTest = () => useAsyncData("test", someAsyncFunc)

async function someAsyncFunc() {
    console.log(`from someAsyncFunc`)
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(877), 10000)
    });
    return await promise;
}