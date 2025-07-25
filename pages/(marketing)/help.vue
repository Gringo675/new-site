<script setup>
useTitle('Как купить - Челябинский Инструмент | Условия покупки и оплаты')
</script>

<template>
  <article class="mx-4 my-8">
    <header class="mb-8">
      <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Как купить</h1>
    </header>

    <section class="space-y-4">
      <p class="text-gray-700">
        <strong>ООО ТД «Челябинский Инструмент»</strong> — надежный поставщик измерительного инструмента и промышленного
        оборудования по всей России и странам СНГ. На нашем сайте вы можете быстро и удобно
        <strong>купить измерительный инструмент</strong> для решения задач в области метрологии и контроля качества.
      </p>

      <p class="text-gray-700">
        <strong>Пошаговая инструкция по покупке:</strong>
      </p>
      <ol class="list-decimal space-y-2 pl-6 text-gray-700">
        <li>
          <strong>Выбор товара в каталоге.</strong> Используйте
          <NuxtLink
            to="/catalog"
            class="text-indigo-600 underline-offset-4 hover:underline"
            >каталог</NuxtLink
          >
          или поиск для быстрого подбора нужного инструмента. Используйте фильтры и категории для точного выбора
          продукции, соответствующей вашим задачам.
        </li>
        <li>
          <strong>Добавление в корзину.</strong> На странице товара укажите необходимое количество и нажмите «В
          корзину». Вы можете продолжить покупки или сразу перейти к оформлению заказа.
        </li>
        <li>
          <strong>Оформление заказа.</strong> Перейдите в корзину (иконка в верхней части сайта), проверьте выбранные
          позиции, скорректируйте количество при необходимости и нажмите «Оформить заказ».
        </li>
        <li>
          <strong>Заполнение данных.</strong> Укажите контактную информацию, реквизиты организации или ИП. Для
          постоянных клиентов доступна авторизация для быстрого оформления и просмотра истории заказов.
        </li>
        <li>
          <strong>Подтверждение и оплата.</strong> После подтверждения заказа вы получите счет на оплату по безналичному
          расчету. При необходимости возможно заключение договора поставки.
        </li>
        <li>
          <strong>Получение товара.</strong> После поступления оплаты мы оперативно комплектуем и отправляем ваш заказ.
          Доступен самовывоз со склада в Челябинске или доставка транспортными компаниями по всей России и СНГ.
          Подробнее — в разделе
          <NuxtLink
            to="/shipping"
            class="text-indigo-600 underline-offset-4 hover:underline"
            >Доставка</NuxtLink
          >.
        </li>
      </ol>

      <div class="my-10">
        <h2 class="mb-4 text-2xl font-semibold text-violet-800">Почему выбирают нас?</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <div
            class="flex flex-col gap-2 rounded-2xl border border-violet-200 bg-white/80 p-6 shadow-xl transition-shadow hover:shadow-2xl"
          >
            <h3 class="flex items-center gap-2 text-lg font-bold text-violet-700">
              <Icon
                name="i-heroicons-check-badge"
                class="text-2xl text-violet-500"
              />
              Официальный поставщик
            </h3>
            <p class="text-violet-700">
              Только сертифицированная продукция с гарантией и всеми необходимыми документами.
            </p>
          </div>
          <div
            class="flex flex-col gap-2 rounded-2xl border border-violet-200 bg-white/80 p-6 shadow-xl transition-shadow hover:shadow-2xl"
          >
            <h3 class="flex items-center gap-2 text-lg font-bold text-violet-700">
              <Icon
                name="i-heroicons-truck"
                class="text-2xl text-violet-500"
              />
              Быстрая доставка
            </h3>
            <p class="text-violet-700">
              Оперативная отгрузка и доставка по всей России и СНГ, самовывоз со склада в Челябинске.
            </p>
          </div>
          <div
            class="flex flex-col gap-2 rounded-2xl border border-violet-200 bg-white/80 p-6 shadow-xl transition-shadow hover:shadow-2xl"
          >
            <h3 class="flex items-center gap-2 text-lg font-bold text-violet-700">
              <Icon
                name="i-heroicons-user-group"
                class="text-2xl text-violet-500"
              />
              Персональный подход
            </h3>
            <p class="text-violet-700">Индивидуальные условия, скидки и консультации для каждого клиента.</p>
          </div>
          <div
            class="flex flex-col gap-2 rounded-2xl border border-violet-200 bg-white/80 p-6 shadow-xl transition-shadow hover:shadow-2xl"
          >
            <h3 class="flex items-center gap-2 text-lg font-bold text-violet-700">
              <Icon
                name="i-heroicons-shield-check"
                class="text-2xl text-violet-500"
              />
              Поддержка и сервис
            </h3>
            <p class="text-violet-700">Профессиональная поддержка на всех этапах покупки и эксплуатации инструмента.</p>
          </div>
        </div>
      </div>

      <p class="text-gray-700">
        <strong>Важные условия:</strong>
      </p>
      <ul class="list-disc space-y-1 pl-6 text-gray-700">
        <li>Мы работаем только с юридическими лицами и индивидуальными предпринимателями.</li>
        <li>Возможны индивидуальные условия по оплате, скидкам и отгрузке — обсудите детали с менеджером.</li>
        <li>Все товары сопровождаются необходимыми документами, сертификатами и паспортами.</li>
        <li>Оперативная поддержка и консультации на всех этапах покупки.</li>
      </ul>

      <p class="text-gray-700">
        <strong>FAQ — Часто задаваемые вопросы:</strong>
      </p>
      <ul class="list-disc space-y-1 pl-6 text-gray-700">
        <li>
          <strong>Можно ли купить без регистрации?</strong> — Да, но для постоянных клиентов рекомендуем создать личный
          кабинет для удобства и отслеживания заказов.
        </li>
        <li>
          <strong>Как узнать стоимость и сроки доставки?</strong> — Рассчитать стоимость можно на странице
          <NuxtLink
            to="/shipping"
            class="text-indigo-600 underline-offset-4 hover:underline"
            >Доставка</NuxtLink
          >
          или уточнить у менеджера.
        </li>
        <li>
          <strong>Как получить консультацию по выбору инструмента?</strong> — Свяжитесь с нашими специалистами по
          телефону, email или через форму обратной связи.
        </li>
        <li>
          <strong>Зачем нужна регистрация?</strong> — Регистрация позволяет сохранять историю заказов, ускоряет
          оформление новых покупок и дает доступ к персональным предложениям.
        </li>
        <li>
          <strong>Как изменить регистрационные данные?</strong> — В личном кабинете вы можете обновить контактную
          информацию и реквизиты организации в любой момент.
        </li>
        <li>
          <strong>Насколько безопасны мои данные?</strong> — Все персональные данные защищены и используются только для
          обработки заказов. Мы не передаем информацию третьим лицам.
        </li>
        <li>
          <strong>Есть ли минимальная сумма заказа?</strong> — Минимальная сумма заказа отсутствует, но для некоторых
          позиций или акций могут действовать ограничения. Уточняйте у менеджера.
        </li>
        <li>
          <strong>Можно ли вернуть товар?</strong> — Да, возврат возможен согласно действующему законодательству РФ.
          Подробности уточняйте у менеджера.
        </li>
      </ul>

      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 class="mb-2 text-lg font-semibold text-slate-700">Конфиденциальность и защита данных</h3>
        <p class="text-sm text-slate-700">
          Мы гарантируем безопасность ваших персональных данных. Вся информация используется исключительно для
          оформления и доставки заказов, а также для связи с клиентом. Данные не передаются третьим лицам и защищены в
          соответствии с требованиями законодательства РФ.
        </p>
      </div>
      <HelperAlarm>
        <template #title>Остались вопросы по покупке?</template>
        <p>
          Получите профессиональную консультацию у наших менеджеров по телефону
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
            @click="showFeedback()"
          >
            задайте вопрос через форму обратной связи.
          </button>
        </p>
      </HelperAlarm>
    </section>
  </article>
</template>
