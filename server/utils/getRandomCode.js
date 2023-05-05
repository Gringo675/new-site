export default () => {
  // возвращает случайное пятизначное число
  const min = 10000
  const max = 99999
  let rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}
