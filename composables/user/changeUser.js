/**
 * Получает массив из измененных значений и отправляет данные на сервер,
 * после чего обновляет пользователя
 */

export default async (changedUserData, options = {}) => {
  //
  options.hidden = options.hidden ?? false

  const response = await myFetch('/api/user/changeUser', {
    method: 'post',
    payload: changedUserData,
  })

  if (response) {
    if (!options.hidden) showNotice('Изменения сохранены!', 'success')
    await getUser({ force: true })
  } else showNotice('Ошибка при обновлении данных!', 'error')
}
