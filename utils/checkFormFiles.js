// проверяет, чтобы общий объем всех файлов на форме был не более 10 Мб
// и количество файлов не более 10 шт.
export default event => {
  if (event.target.files.length > 10) {
    showNotice({ title: 'Слишком много файлов!', description: 'Максимальное количество - 10 штук.', type: 'error' })
    event.target.value = ''
    return
  }
  let overallSize = 0
  for (const file of event.target.files) {
    overallSize += file.size
  }
  if (overallSize > 10485760) {
    showNotice({
      title: 'Слишком большой размер файла(-ов)!',
      description: 'Максимальный объем - 10 Мб.',
      type: 'error',
    })

    event.target.value = ''
  }
}
