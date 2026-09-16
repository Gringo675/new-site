/**
 * Извлекает год издания из номера документа (берётся часть после последнего дефиса).
 * @param {string} docNumber
 * @returns {number} 4-значный год или -1, если год не найден
 */
export function parseDocYear(docNumber) {
  if (!docNumber || typeof docNumber !== 'string') return -1

  const trimmed = docNumber.trim()
  const lastHyphenIdx = trimmed.lastIndexOf('-')
  if (lastHyphenIdx === -1) return -1

  const suffix = trimmed.slice(lastHyphenIdx + 1).trim()
  const match = suffix.match(/^(\d{2}|\d{4})\b/)
  if (!match) return -1

  const valStr = match[1]
  if (valStr.length === 4) {
    return parseInt(valStr, 10)
  }
  if (valStr.length === 2) {
    const yy = parseInt(valStr, 10)
    return yy >= 50 ? 1900 + yy : 2000 + yy
  }

  return -1
}

/**
 * Сортирует массив документов по году (year DESC, затем number ASC).
 * Документы с нераспознанным годом (year = -1) помещаются в конец.
 * @template T
 * @param {T[]} docs
 * @returns {T[]} Новый отсортированный массив
 */
export function sortDocsByYear(docs) {
  if (!Array.isArray(docs) || !docs.length) return []

  return [...docs].sort((a, b) => {
    const yearA = a.year ?? parseDocYear(a.number)
    const yearB = b.year ?? parseDocYear(b.number)

    if (yearA !== yearB) {
      if (yearA === -1) return 1
      if (yearB === -1) return -1
      return yearB - yearA // DESC
    }

    const numA = a.number || ''
    const numB = b.number || ''
    return numA.localeCompare(numB, 'ru', { numeric: true })
  })
}
