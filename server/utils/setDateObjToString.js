export default date => {
  // преобразует объект даты в строку
  // объекты могут быть "неправильными", т.к. в mysql можно хранить даты с нулями, а в JS это приводит к ошибке

  try {
    return date.toISOString()
  } catch (e) {
    return '' // пустая дата
  }
}
