/**
 * Universal file checker for both client and server side.
 * Checks files against size limits and returns error message (empty string if valid).
 * @param {Array|FileList} files - Array of files from form or uploaded files on server
 * @returns {string} Error message or empty string if valid
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB per file
const MAX_TOTAL_SIZE = 7 * 1024 * 1024 // 20MB total size

const getFileSize = file => {
  // For client-side File objects
  if (file.size !== undefined) return file.size
  // For server-side file with content.data
  if (file.content?.data?.length !== undefined) return file.content.data.length
  return 0
}

const getFileName = file => {
  // For client-side File objects
  if (file.name !== undefined) return file.name
  // For server-side file with filename
  if (file.filename !== undefined) return file.filename
  return 'unknown'
}

export default files => {
  // Handle different input types
  if (!files) return ''

  // Convert FileList or array-like object to Array
  const filesArray = Array.from(files)

  if (filesArray.length > 10) return 'Допускается прикреплять не более 10 файлов!'

  let totalSize = 0

  for (const file of filesArray) {
    if (!file) return 'Некорректный формат файла!'

    const fileName = getFileName(file)
    const fileSize = getFileSize(file)

    if (fileSize > MAX_FILE_SIZE) {
      return `Файл "${fileName}" превышает максимальный размер ${MAX_FILE_SIZE / 1024 / 1024} MB!`
    }
    totalSize += fileSize
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    return `Общий размер файлов превышает лимит ${MAX_TOTAL_SIZE / 1024 / 1024} MB!`
  }

  return ''
}
