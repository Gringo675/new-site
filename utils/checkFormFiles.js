// проверяет, чтобы общий объем всех файлов на форме был не более 10 Мб
// и количество файлов не более 10 шт.
export default event => {
  if (event.target.files.length > 10) {
    showNotice('Слишком много файлов! Максимальное количество - 10 штук.', 'error')
    event.target.value = ''
    return
  }
  let overallSize = 0
  for (const file of event.target.files) {
    overallSize += file.size
  }
  if (overallSize > 10485760) {
    showNotice('Слишком большой размер файла(-ов)! Максимальный объем - 10 Мб.', 'error')
    event.target.value = ''
  }
}
