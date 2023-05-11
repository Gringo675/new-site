/**
 * Получает объект типа {поле: новое_значение} и отправляет данные на сервер,
 * после чего обновляет пользователя
 */

export default async newData => {
  const response = await myFetch('/api/user/changeUser', {
    method: 'post',
    payload: newData,
  })

  if (response) {
    showNotice('Изменения сохранены!', 'success')
    await getUser({ force: true })
  } else showNotice('Ошибка при обновлении данных!', 'error')
}
