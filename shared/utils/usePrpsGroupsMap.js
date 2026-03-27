export const usePrpsGroupsMap = catId => {
  //
  const map = new Map([
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
      'p0_brand',
      {
        name: 'Производитель',
        ordering: 80,
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
