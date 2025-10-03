const company = {
  name: 'ООО ТД «Челябинский Инструмент»',
  address: {
    short: 'г. Челябинск, ул. Болейко, 5',
    post: '454084, Россия, г. Челябинск, ул. Болейко, 5-1',
    official: '454053, ЧЕЛЯБИНСКАЯ ОБЛАСТЬ, Г.О. ЧЕЛЯБИНСКИЙ, ВН.Р-Н СОВЕТСКИЙ, Г ЧЕЛЯБИНСК, УЛ КАРАБАНОВА, Д. 18',
    // Поля для schema.org
    '@type': 'PostalAddress',
    streetAddress: 'ул. Болейко, 5-1',
    addressLocality: 'Челябинск',
    postalCode: '454084',
    addressCountry: 'RU',
  },
  phones: ['+7 (351) 790-77-48', '+7 (351) 735-99-21'],
  mails: ['info@chelinstrument.ru', 'meritel@mail.ru'],
  requisites: {
    inn: '7448078612',
    kpp: '745301001',
    ogrn: '1067448049624',
  },
  // Добавьте сюда ссылки на ваши социальные сети
  sameAs: [
    // 'https://vk.com/your_company',
    // 'https://youtube.com/your_company',
  ],
}

export default () => company
