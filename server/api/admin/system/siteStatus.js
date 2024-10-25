export default defineEventHandler(async event => {
  /**
   * Отвечает за открытие/закрытие сайта.
   * При пустом запросе отдает текущее состояние сайте.
   */

  const setStatus = (await readBody(event)).setStatus

  if (setStatus === '0' || setStatus === '1') process.env.IS_SITE_CLOSED = setStatus

  return process.env.IS_SITE_CLOSED ?? '0'
})
