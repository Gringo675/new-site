/**
 * Используется в валидаторе формы на страницах обратной связи и комментарии к заказу.
 * Проверяет, чтобы общий объем всех файлов на форме был не более 10 Мб и количество файлов не более 10 шт.
 * files - массив файлов из input file формы
 * errors - массив ошибок
 */

export default (files, errors) => {
  if (files.length > 10) {
    errors.push({ path: 'files', message: 'Допускается прикреплять не более 10 файлов!' })
    return
  }
  let overallSize = 0
  for (const file of files) {
    overallSize += file.size
  }
  if (overallSize > 10485760)
    errors.push({ path: 'files', message: 'Максимальный объем файлов должен быть не более 10 Мб!' })
}
