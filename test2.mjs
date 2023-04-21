
const getRandomCode = () => {
    // возвращает случайное пятизначное число
    const min = 10000
    const max = 99999
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand);
}

for (let i = 0; i < 100; i++) {
const aaa = getRandomCode()
    console.log(`code: ${JSON.stringify(aaa, null, 2)}`)
}

