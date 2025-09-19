<script setup>
useTitle('Доставка - Челябинский Инструмент | Условия и способы доставки')
</script>

<template>
  <article class="mx-4 my-8">
    <header class="mb-8">
      <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Доставка заказов</h1>
    </header>

    <section class="space-y-10">
      <div class="flex flex-col gap-8 md:flex-row">
        <div class="flex-1 space-y-4">
          <p class="text-gray-700">
            <strong>ООО ТД «Челябинский Инструмент»</strong> организует доставку заказов по всей России и странам СНГ с
            помощью ведущих транспортных компаний. Мы обеспечиваем быструю, надежную и удобную доставку, учитывая
            индивидуальные пожелания каждого клиента.
          </p>

          <p class="text-gray-700">
            <strong>Варианты получения заказа:</strong>
          </p>
          <ul class="list-disc space-y-1 pl-6 text-gray-700">
            <li>
              <strong>Самовывоз</strong> — вы можете самостоятельно забрать заказ со склада по адресу: г. Челябинск, ул.
              Болейко, 5. Для получения необходимы доверенность от организации-плательщика и паспорт получателя.
              Подробнее о режимах работы и схему проезда смотрите в разделе
              <NuxtLink
                to="/contacts"
                class="text-indigo-600 underline-offset-4 hover:underline"
                >Контакты</NuxtLink
              >.
            </li>
            <li>
              <strong>Доставка транспортными компаниями</strong> — мы сотрудничаем только с проверенными перевозчиками,
              что гарантирует сохранность и оперативность доставки.
            </li>
          </ul>

          <p class="text-gray-700">Мы работаем с ведущими транспортными компаниями:</p>

          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <div
              class="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div class="mb-2 flex items-center justify-between gap-2 border-b border-indigo-200 pb-1">
                <h3 class="text-lg font-bold tracking-tight text-indigo-800">Деловые Линии</h3>
                <img
                  :src="'/static/img/carriers/dl.svg'"
                  alt="Деловые Линии"
                  class="h-8 w-auto" />
              </div>

              <p class="mb-3 text-sm text-gray-700">
                Ведущий перевозчик по России и СНГ. Обширная сеть филиалов, доставка "до двери" или до терминала.
              </p>
              <ul class="space-y-1 text-xs">
                <li>
                  <span class="pr-2 font-semibold">Калькулятор:</span>
                  <NuxtLink
                    to="https://www.dellin.ru/requests/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >dellin.ru/requests</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Отслеживание:</span>
                  <NuxtLink
                    to="https://www.dellin.ru/tracker/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >dellin.ru/tracker</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Адреса терминалов:</span>
                  <NuxtLink
                    to="https://www.dellin.ru/contacts/terminals/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >dellin.ru/contacts/terminals</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Телефон:</span>
                  <NuxtLink
                    to="tel:88001008000"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >8 800 100-8000</NuxtLink
                  >
                </li>
              </ul>
            </div>
            <div
              class="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div class="mb-2 flex items-center justify-between gap-2 border-b border-indigo-200 pb-1">
                <h3 class="text-lg font-bold tracking-tight text-indigo-800">ПЭК</h3>
                <img
                  :src="'/static/img/carriers/pek.svg'"
                  alt="ПЭК"
                  class="h-8 w-auto" />
              </div>
              <p class="mb-3 text-sm text-gray-700">
                Одна из крупнейших ТК, доставка по России, СНГ, Китаю. Услуги: перевозка, упаковка, страхование,
                доставка "до двери".
              </p>
              <ul class="space-y-1 text-xs">
                <li>
                  <span class="pr-2 font-semibold">Калькулятор:</span>
                  <NuxtLink
                    to="https://pecom.ru/ru/calculator/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >pecom.ru/calculator</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Отслеживание:</span>
                  <NuxtLink
                    to="https://pecom.ru/ru/tracking/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >pecom.ru/tracking</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Адреса терминалов:</span>
                  <NuxtLink
                    to="https://pecom.ru/ru/contacts/filials/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >pecom.ru/contacts/filials</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Телефон:</span>
                  <NuxtLink
                    to="tel:88007007000"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >8 800 700-7000</NuxtLink
                  >
                </li>
              </ul>
            </div>
            <div
              class="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div class="mb-2 flex items-center justify-between gap-2 border-b border-indigo-200 pb-1">
                <h3 class="text-lg font-bold tracking-tight text-indigo-800">ЖелДорЭкспедиция</h3>
                <img
                  :src="'/static/img/carriers/jde.svg'"
                  alt="ЖелДорЭкспедиция"
                  class="h-8 w-auto" />
              </div>
              <p class="mb-3 text-sm text-gray-700">
                25 лет на рынке, доставка по России, Китаю, Казахстану, ЕС. Услуги: перевозка, упаковка, доставка до
                двери, страхование, хранение.
              </p>
              <ul class="space-y-1 text-xs">
                <li>
                  <span class="pr-2 font-semibold">Калькулятор:</span>
                  <NuxtLink
                    to="https://www.jde.ru/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >jde.ru</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Отслеживание:</span>
                  <NuxtLink
                    to="https://www.jde.ru/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >jde.ru</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Адреса филиалов:</span>
                  <NuxtLink
                    to="https://www.jde.ru/"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline">
                    jde.ru
                  </NuxtLink>
                </li>
                <li>
                  <span class="pr-2 font-semibold">Телефон:</span>
                  <NuxtLink
                    to="tel:88001005999"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >8 800 100-5999</NuxtLink
                  >
                </li>
              </ul>
            </div>
            <div
              class="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div class="mb-2 flex items-center justify-between gap-2 border-b border-indigo-200 pb-1">
                <h3 class="text-lg font-bold tracking-tight text-indigo-800">ТК КИТ</h3>
                <img
                  :src="'/static/img/carriers/kit.svg'"
                  alt="ТК КИТ"
                  class="h-8 w-auto" />
              </div>
              <p class="mb-3 text-sm text-gray-700">
                Широкая география перевозок, персональный менеджер 24/7, интеграция с ЭДО, адаптация под бизнес-процессы
                клиента.
              </p>
              <ul class="space-y-1 text-xs">
                <li>
                  <span class="pr-2 font-semibold">Калькулятор:</span>
                  <NuxtLink
                    to="https://tk-kit.ru/order"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline">
                    tk-kit.ru/order
                  </NuxtLink>
                </li>
                <li>
                  <span class="pr-2 font-semibold">Отслеживание:</span>
                  <NuxtLink
                    to="https://tk-kit.ru/services#track-load-modal"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline">
                    tk-kit.ru/services#track-load-modal
                  </NuxtLink>
                </li>
                <li>
                  <span class="pr-2 font-semibold">Адреса терминалов:</span>
                  <NuxtLink
                    to="https://tk-kit.ru/clients/geography"
                    target="_blank"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >tk-kit.ru/clients/geography</NuxtLink
                  >
                </li>
                <li>
                  <span class="pr-2 font-semibold">Телефон:</span>
                  <NuxtLink
                    to="tel:88002345960"
                    class="text-indigo-600 underline-offset-4 hover:underline"
                    >8 800 234-59-60</NuxtLink
                  >
                </li>
              </ul>
            </div>
          </div>

          <p class="mt-4 text-gray-700">
            <strong>Доставка по России и СНГ</strong> осуществляется до терминала транспортной компании в вашем городе
            или до адреса получателя (по согласованию). Стоимость и сроки доставки зависят от выбранной ТК, веса и
            габаритов груза, а также региона назначения. Вы всегда можете рассчитать стоимость доставки на сайте
            выбранной транспортной компании.
          </p>

          <p class="text-gray-700">
            <strong>Условия доставки:</strong>
          </p>
          <ul class="list-disc space-y-1 pl-6 text-gray-700">
            <li>Доставка до терминала ТК в Челябинске — бесплатно.</li>
            <li>Услуги перевозчика между городами оплачиваются по тарифам выбранной ТК.</li>
            <li>Возможна отправка другими ТК по согласованию с менеджером.</li>
            <li>Отправка заказов производится ежедневно в рабочие дни.</li>
            <li>Вся продукция комплектуется необходимыми документами, паспортами и сертификатами.</li>
            <li>Упаковка осуществляется с учетом требований перевозчика и особенностей груза.</li>
          </ul>

          <p class="text-gray-700">
            <strong>Информирование и отслеживание:</strong> После отправки заказа вы получите всю необходимую информацию
            для отслеживания груза на сайте транспортной компании.
          </p>
        </div>
      </div>

      <HelperAlarm>
        <template #title>Нужна консультация по доставке?</template>
        <p>
          Свяжитесь с нашими менеджерами по телефону
          <NuxtLink
            to="tel:+73517907748"
            title="Позвонить"
            class="text-indigo-600 underline-offset-4 hover:underline"
            >+7 (351) 790-77-48</NuxtLink
          >, электронной почте
          <NuxtLink
            to="mailto:info@chelinstrument.ru"
            class="text-indigo-600 underline-offset-4 hover:underline"
            >info@chelinstrument.ru</NuxtLink
          >, либо
          <button
            class="text-indigo-600 underline-offset-4 hover:underline"
            @click="showFeedback()">
            задайте вопрос через форму обратной связи.
          </button>
        </p>
      </HelperAlarm>
    </section>
  </article>
</template>
