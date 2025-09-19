/**
 * Форматирует число в денежную строку с указанием валюты.
 * @param price - Число для форматирования.
 * @param showCoins - Показывать ли копейки (2 знака после запятой). По умолчанию false (только целое).
 * @returns - Отформатированная строка (напр., "77 520 ₽" или "77 520,50 ₽") или плейсхолдер.
 */
export default (price: number | null | undefined, showCoins: boolean = false): string => {
  if (typeof price !== 'number') return '—'

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: showCoins ? 2 : 0,
    maximumFractionDigits: showCoins ? 2 : 0,
  }

  return price.toLocaleString('ru-RU', options)
}
