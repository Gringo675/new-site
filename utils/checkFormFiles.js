/**
 * Используется в валидаторе формы на страницах обратной связи и комментарии к заказу.
 * Проверяет полученные файлы, отдает строку ошибки или пустую строку.
 * files - массив файлов из input file формы
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB на 1 файл
const MAX_TOTAL_SIZE = 20 * 1024 * 1024 // 20MB общий размер

export default (files, errors) => {
  if (!files || (!files) instanceof DataTransfer || (!files) instanceof FileList) return ''
  if (files.length > 10) return 'Допускается прикреплять не более 10 файлов!'

  let totalSize = 0

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE)
      return `Файл "${file.name}" превышает максимальный размер ${MAX_FILE_SIZE / 1024 / 1024} MB!`
    totalSize += file.size
  }
  if (totalSize > MAX_TOTAL_SIZE) return `Общий размер файлов превышает лимит ${MAX_TOTAL_SIZE / 1024 / 1024} MB!`

  return ''
}
