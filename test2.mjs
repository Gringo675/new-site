let i=0

const writeToStream = () => {
    console.log(`i: ${JSON.stringify(i, null, 2)}`)
    i++
}
setInterval(writeToStream, 3000)

const aaa = process.stdout
console.log(`typeof process.stdout: ${JSON.stringify(typeof process.stdout, null, 2)}`)
// process.stdin.on("data", data => {
//     data = data.toString().toUpperCase()
//     process.stdout.write(data + "\n")
// })

// process.stdout.on("data", data => {
//     console.log(`from stdout`)
// })