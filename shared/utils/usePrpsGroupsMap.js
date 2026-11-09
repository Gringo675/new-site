/**
 * @typedef {Object} PropGroupConfig
 * @property {string} name - Отображаемое название группы в интерфейсе
 * @property {number} ordering - Порядок отображения группы в фильтре на страницах категорий
 * @property {boolean} [disabled] - Если true, группа исключается из фильтра и не участвует в sort_key (значение '9999')
 * @property {number} [sortOrdering] - Опциональный оверрайд веса группы для расчета sort_key товара
 * @property {boolean} [emptyFirst] - Если true, товары без этого свойства получают '0000' (идут первыми)
 */

/**
 * Возвращает карту групп характеристик товаров (p0_brand ... p8_pack).
 * Порядок групп в Map соответствует group_id в таблице i_properties:
 * p0_brand -> group_id=0, p1_type -> group_id=1, ..., p8_pack -> group_id=8.
 *
 * @param {number} [catId]
 * @returns {Map<string, PropGroupConfig>}
 */
export const usePrpsGroupsMap = catId => {
  /** @type {Map<string, PropGroupConfig>} */
  const map = new Map([
    [
      'p0_brand',
      {
        name: 'Производитель',
        ordering: 80,
      },
    ],
    [
      'p1_type',
      {
        name: 'Тип',
        ordering: 10,
      },
    ],
    [
      'p2_counting_system',
      {
        name: 'Система отсчета',
        ordering: 20,
      },
    ],
    [
      'p3_range',
      {
        name: 'Диапазон измерений',
        ordering: 30,
      },
    ],
    [
      'p4_size',
      {
        name: 'Размерность',
        ordering: 40,
      },
    ],
    [
      'p5_accuracy',
      {
        name: 'Точность отсчета',
        ordering: 50,
      },
    ],
    [
      'p6_class',
      {
        name: 'Класс',
        ordering: 60,
      },
    ],
    [
      'p7_feature',
      {
        name: 'Особенности',
        ordering: 70,
      },
    ],
    [
      'p8_pack',
      {
        name: 'Упаковка',
        ordering: 90,
        disabled: true, // для изменения не присваивать false, а удалять, т.е. delete catProps.p8_pack.disabled
      },
    ],
  ])

  if (catId) {
    // you can map returned data but only for main categories
    switch (catId) {
      case 11: // штангенциркули
        map.get('p4_size').name = 'Губки'
        map.get('p4_size').ordering = 51
        map.get('p7_feature').name = 'Материал'
        map.get('p7_feature').sortOrdering = 8
        map.get('p7_feature').emptyFirst = true
        map.get('p2_counting_system').sortOrdering = 9
        break
      case 12: // штангенглубиномеры
        map.get('p7_feature').name = 'Зацеп (толщиномер)'
        break
      case 16: // индикаторы
        map.get('p7_feature').name = 'Наличие ушка'
        break
      case 19: // КМД
        map.get('p1_type').name = 'Категория'
        map.get('p4_size').name = 'Набор'
        break
      case 22: // Стенкомеры, толщиномеры
        map.get('p4_size').name = 'Вылет скобы'
        map.get('p7_feature').name = 'Модификация'
        break
      case 24: // Угольники
        map.get('p4_size').name = 'Размер'
        break
      case 25: // Уровни
        map.get('p4_size').name = 'Размер'
        break
      case 26: // Линейки
        map.get('p4_size').name = 'Длина'
        break
      case 29: // Штативы, стойки
        map.get('p4_size').name = 'Модели'
        break
      case 30: // Щупы и шаблоны
        map.get('p3_range').name = 'Набор'
        map.get('p4_size').name = 'Модификация'
        break
      case 32: // Кронциркули, циркули
        map.get('p4_size').name = 'Длина'
        map.get('p7_feature').name = 'Модификация'
        break
      case 33: // Рулетки
        map.get('p7_feature').name = 'Лента'
        break
      case 35: // Пластины
        map.get('p4_size').name = 'Диаметр'
        break
    }
  }

  return map
}
