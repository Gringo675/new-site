export default async (sec) => {
    let promise = new Promise((resolve) => {
        setTimeout(() => resolve(), sec * 1000)
    });
    return await promise;
}