<script setup>
//
useTitle('Контакты - Челябинский Инструмент | Поставщик измерительного инструмента')

const company = useCompany()

onMounted(() => {
  if (typeof ymaps !== 'undefined') {
    ymaps.ready(init)
    return
  }

  const script = document.createElement('script')
  script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
  script.type = 'text/javascript'
  script.onload = () => {
    ymaps.ready(init)
  }
  script.onerror = error => {
    console.error('Failed to load Yandex Map script:', error)
  }
  document.head.appendChild(script)
})

function init() {
  var myMap = new ymaps.Map('map', {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.186362, 61.405446],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 17,
  })
  var myPlacemark = new ymaps.Placemark(
    [55.186408, 61.406128],
    {
      // Хинт показывается при наведении мышкой на иконку метки.
      hintContent: 'Челябинский Инструмент',
      // Балун откроется при клике по метке.
      balloonContent:
        '<strong>Челябинский Инстумент</strong><br>454084 Россия, г. Челябинск, ул. Болейко, 5<br>Тел.:+7 (351) 790-77-48, 235-99-21',
    },
    {
      // Опции
      // Иконка метки будет растягиваться под ее контент
      iconLayout: 'default#image',
      // Путь до нашей картинки
      iconImageHref: '/img/iconmapi.png',
      // Размер по ширине и высоте
      iconImageSize: [35, 55],
      // Смещение левого верхнего угла иконки относительно
      // её «ножки» (точки привязки).
      iconImageOffset: [-15, -50],
    },
  )
  // Создаем парковку
  var myPolygon = new ymaps.Polygon(
    [
      [
        // Координаты вершин внешней границы многоугольника.
        [55.18623, 61.4063],
        [55.1863, 61.4063],
        [55.1863, 61.40646],
        [55.186235, 61.40646],
      ],
    ],
    {
      //Свойства
      hintContent: 'Парковка',
    },
    {
      // Опции.

      // Цвет границ (синий)
      strokeColor: '#0000FF',
      // Прозрачность (полупрозрачная заливка)
      opacity: 0.6,
      // Ширина линии
      strokeWidth: 1,
      // Стиль линии
      strokeStyle: 'shortdash',
      // Фоновое изображение.
      fillImageHref: '/img/iconparking.png',
      // Тип заливки фоном.
      fillMethod: 'stretch',
    },
  )
  // Линии - дороги
  var myPolyline1 = new ymaps.Polyline(
    [
      [55.185871, 61.4055],
      [55.185914, 61.406689],
      [55.186155, 61.406656],
      [55.186176, 61.406643],
      [55.186267, 61.406528],
      [55.186265, 61.40647],
    ],
    {
      // Описываем свойства геообъекта.
    },
    {
      // Задаем опции геообъекта.
      // Цвет линии.
      strokeColor: '#0000FF',
      // Ширина линии.
      strokeWidth: 2,
      // Коэффициент прозрачности.
      strokeOpacity: 0.5,
      strokeStyle: 'shortdash',
    },
  )
  var myPolyline2 = new ymaps.Polyline(
    [
      [55.186224, 61.406286],
      [55.186213, 61.405997],
      [55.186269, 61.405992],
      [55.18627, 61.406032],
    ],
    {
      // Описываем свойства геообъекта.
    },
    {
      // Задаем опции геообъекта.
      // Цвет линии.
      strokeColor: '#0000FF',
      // Ширина линии.
      strokeWidth: 2,
      // Коэффициент прозрачности.
      strokeOpacity: 0.5,
      strokeStyle: 'shortdash',
    },
  )
  var Arrow = new ymaps.Polyline(
    [
      [55.18628, 61.40603],
      [55.18627, 61.406055],
      [55.18626, 61.40603],
    ],
    {
      // Описываем свойства геообъекта.
    },
    {
      // Задаем опции геообъекта.
      // Цвет линии.
      strokeColor: '#0000FF',
      // Ширина линии.
      strokeWidth: 2,
      // Коэффициент прозрачности.
      strokeOpacity: 0.5,
    },
  )
  // Добавляем метки на карту.
  myMap.geoObjects.add(myPlacemark).add(myPolygon).add(myPolyline1).add(myPolyline2).add(Arrow)
  //Отключаем изменение масштаба колесиком мышки
  myMap.behaviors.disable('scrollZoom')
  //Отключаем перетаскивание для мобильных и активируем подсказку
  if (window.innerWidth < 768) {
    myMap.behaviors.disable('drag')
  }
}
</script>

<template>
  <article class="mx-4 my-8">
    <header class="mb-8">
      <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Контакты</h1>
    </header>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="col1 space-y-4">
        <p class="font-bold">{{ company.name }}</p>
        <div class="space-y-2">
          <div
            class="flex items-center gap-2"
            v-for="(phone, idx) in company.phones"
            :key="phone">
            <Icon
              name="i-lucide-phone"
              class="text-primary size-5" />
            <a
              :href="`tel:${phone.replace(/\D/g, '')}`"
              class="font-medium text-indigo-600 underline-offset-4 hover:underline"
              >{{ phone }}</a
            >
            <span
              v-if="idx === 0"
              class="text-xs text-gray-500"
              >(отдел продаж, 9:00–18:00)</span
            >
            <span
              v-else-if="idx === 1"
              class="text-xs text-gray-500"
              >(бухгалтерия)</span
            >
          </div>
          <div
            class="flex items-center gap-2"
            v-for="(mail, idx) in company.mails"
            :key="mail">
            <Icon
              name="i-lucide-mail"
              class="text-primary size-5" />
            <a
              :href="`mailto:${mail}`"
              class="font-medium text-indigo-600 underline-offset-4 hover:underline"
              >{{ mail }}</a
            >
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-start gap-2">
            <Icon
              name="i-lucide-map-pin"
              class="text-primary mt-1 size-5" />
            <div>
              <span class="font-semibold">Офис и склад:</span> {{ company.address.short }}<br />
              <span class="text-xs text-gray-500"
                >Пн–Пт: 9:00–18:00 (выдача продукции: 10:00–17:00, в другое время — по согласованию)</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Icon
              name="i-lucide-mailbox"
              class="text-primary size-5" />
            <div><span class="font-semibold">Почтовый адрес:</span> {{ company.address.post }}</div>
          </div>
          <div class="flex items-start gap-2">
            <Icon
              name="i-lucide-file-text"
              class="text-primary size-5" />
            <div><span class="font-semibold">Юридический адрес:</span> {{ company.address.official }}</div>
          </div>
        </div>

        <div class="flex items-start">
          <div class="flex items-start gap-2">
            <Icon
              name="i-lucide-file-text"
              class="text-primary size-5" />
            <div class="font-semibold">Реквизиты:</div>
          </div>
          <ul class="ml-6 list-disc space-y-2">
            <li>
              <span class="font-semibold">ИНН:</span> <span>{{ company.requisites.inn }}</span>
            </li>
            <li>
              <span class="font-semibold">КПП:</span> <span>{{ company.requisites.kpp }}</span>
            </li>
            <li>
              <span class="font-semibold">ОГРН:</span> <span>{{ company.requisites.ogrn }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="col2 space-y-2">
        <p class="text-xl font-semibold">Как добраться</p>
        <p class="">
          Ориентиры: Теплотехнический институт, Ленинградский мост, Торговый комплекс "Ленинградский", магазин
          "Автолайн".
        </p>
        <p>
          При движении со стороны пр. Победы - третий дом справа после перекрестка ул. Болейко - пр. Победы. При
          движении со стороны ул. Каслинская - слева, напротив офисного здания.
        </p>
        <p>
          Офис и склад выдачи продукции находятся по адресу: г. Челябинск, ул. Болейко, д. 5 - жилой девятиэтажный дом,
          отдельный вход к нам расположен на углу здания (ближнему к пр. Победы, сине-оранжевая входная группа).
        </p>
        <p>
          Для получения заказа необходима доверенность от организации-плательщика и паспорт получателя. При заборе
          курьером от транспортной компании - доверительное письмо на данную ТК. Время выдачи продукции: с 10-00 до
          17-00 понедельник-пятница, в другое время - только по предварительному согласованию с менеджером.
        </p>
      </div>
    </div>
    <div class="my-6">
      <div
        id="map"
        class="flex h-75 w-full items-center justify-center">
        <div class="aspect-square w-10 animate-ping rounded-full bg-violet-300"></div>
      </div>
      <p class="m-2 text-sm italic md:hidden">* Для навигации по карте используйте жест двумя пальцами</p>
    </div>
    <HelperAlarm>
      <template #title>Остались вопросы?</template>
              <p>
                Свяжитесь с нашими менеджерами по телефону
                <a
                  :href="'tel:' + company.phones[0]"
                  title="Позвонить"
                  class="text-indigo-600 underline-offset-4 hover:underline"
                  >{{ company.phones[0] }}</a
                >, электронной почте
                <a
                  :href="'mailto:' + company.mails[0]"
                  class="text-indigo-600 underline-offset-4 hover:underline"
                  >{{ company.mails[0] }}</a
                >, либо
                <button
                  class="text-indigo-600 underline-offset-4 hover:underline"
                  @click="showFeedback()">
                  задайте вопрос через форму обратной связи.
                </button>
              </p>    </HelperAlarm>
  </article>
</template>
