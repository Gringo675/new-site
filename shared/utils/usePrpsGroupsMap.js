export const usePrpsGroupsMap = catId => {
  // the order of groups should match the group_id in i_properties table, i.e. p0_brand has group_id=0, p1_type has group_id=1 and so on
  // disabled: true means that this group doesn't include in filter on category pages
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
    switch (catId) {
      case 11: // штангенциркули
        map.get('p4_size').name = 'Губки'
        map.get('p4_size').ordering = 51
        break
    }
  }

  return map
}
