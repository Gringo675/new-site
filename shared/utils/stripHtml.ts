// shared/utils/stripHtml.ts

export const stripHtml = (html: string | null | undefined): string => {
  if (!html) {
    return ''
  }

  return html
    // 1. Заменяем HTML-теги на пробел, чтобы избежать слипания слов.
    .replace(/<[^>]+>/g, ' ')
    // 2. Заменяем любые последовательности пробельных символов (включая \n) на один пробел.
    .replace(/\s\s+/g, ' ')
    // 3. Убираем лишние пробелы в начале и конце строки.
    .trim()
}