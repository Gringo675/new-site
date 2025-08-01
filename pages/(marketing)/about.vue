<script setup>
useTitle('О компании - Челябинский Инструмент | Поставщик измерительного инструмента')

const advantages = [
  {
    icon: 'i-heroicons-trophy',
    title: '20+ лет опыта',
    description:
      'С 2000 года снабжаем клиентов по всей России современным измерительным инструментом и промышленным оборудованием.',
  },
  {
    icon: 'i-heroicons-archive-box',
    title: 'Более 5 000 позиций',
    description:
      'Широкий ассортимент продукции от ведущих российских и зарубежных производителей — для любых задач и отраслей.',
  },
  {
    icon: 'i-heroicons-shield-check',
    title: 'Гарантия качества',
    description: 'Только сертифицированный инструмент, соответствующий ГОСТам РФ и международным стандартам.',
  },
  {
    icon: 'i-heroicons-truck',
    title: 'Доставка по всей России',
    description: 'Оперативная доставка транспортными компаниями и собственным автотранспортом — в любой регион страны.',
  },
  {
    icon: 'i-heroicons-building-office-2',
    title: 'Прямые поставки от производителей',
    description: 'Официальные дилерские и партнерские соглашения с заводами-изготовителями.',
  },
  {
    icon: 'i-heroicons-document-check',
    title: 'Поверка и калибровка',
    description: 'Организуем поверку и калибровку инструмента для гарантии точности и надежности.',
  },
  {
    icon: 'i-heroicons-bolt',
    title: 'Минимальные сроки поставки',
    description: 'Быстрая комплектация и отгрузка — получение продукции на складе сразу после оплаты.',
  },
  {
    icon: 'i-heroicons-user-group',
    title: 'Персональный подход',
    description: 'Индивидуальные условия, скидки и консультации для каждого клиента. Мы ценим ваше доверие!',
  },
]
</script>

<template>
  <article class="mx-4 my-8">
    <header class="mb-8">
      <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">О компании</h1>
    </header>

    <section class="space-y-10">
      <div class="flex flex-col gap-8 md:flex-row">
        <div class="flex-1 space-y-4">
          <p class="">
            <strong>ООО ТД «Челябинский Инструмент»</strong> — ведущий поставщик измерительного инструмента и
            промышленного оборудования в России с 2000 года. Компания основана на базе Производственного Холдинга
            «Челябинский Инструмент» и изначально специализировалась на организации сбыта продукции Челябинского
            Инструментального Завода. Сегодня мы — самостоятельная структура, предлагающая комплексные решения для
            предприятий и частных клиентов по всей России и странам СНГ.
          </p>

          <p class="">
            За годы работы мы выстроили прочные партнерские отношения с ведущими производителями инструментов:
          </p>

          <ul class="list-disc space-y-1 pl-6">
            <li>Челябинский Инструментальный Завод</li>
            <li>Ставропольский Инструментальный Завод</li>
            <li>Кировский Инструментальный Завод «КировИнструмент»</li>
            <li>Российская производственная компания «ИТО-Туламаш»</li>
            <li>Международный холдинг GRIFF</li>
          </ul>

          <p class="">
            И это далеко не полный список производителей, с которыми мы сотрудничаем. Мы постоянно расширяем круг наших
            партнёров, чтобы предлагать клиентам ещё более широкий ассортимент продукции и самые современные решения.
            Благодаря тесному сотрудничеству с ведущими российскими и зарубежными компаниями, мы можем гарантировать
            высокое качество, надёжность и актуальность поставляемого инструмента. Если вы не нашли интересующего вас
            производителя в этом списке — свяжитесь с нами, и мы постараемся предложить оптимальное решение под ваши
            задачи.
          </p>

          <p class="">
            Мы активно выводим на российский рынок инновационные измерительные приборы зарубежных брендов, не имеющие
            аналогов в стране. Такой подход обеспечивает нашим клиентам максимальный выбор по ассортименту, техническим
            характеристикам и ценам.
          </p>

          <p class="">
            География деятельности охватывает всю Россию и ближнее зарубежье. Собственный склад и эффективная логистика
            позволяют быстро комплектовать и доставлять заказы — как транспортными компаниями, так и собственным
            автопарком.
          </p>
        </div>

        <div class="flex flex-col gap-4 md:w-1/3">
          <h3 class="mb-2 text-xl font-semibold">Отзывы клиентов</h3>
          <div class="space-y-8">
            <div class="relative">
              <div class="font-fancy relative rounded-2xl bg-violet-100 p-4 font-semibold text-gray-500 shadow">
                ...остались довольны качеством поставленной продукции, а также профессионализмом ваших сотрудников.
                <span
                  class="absolute -bottom-4 left-8 h-0 w-0 border-t-[16px] border-r-[16px] border-l-[16px] border-t-violet-100 border-r-transparent border-l-transparent"></span>
              </div>
              <cite class="mt-6 block pl-6 text-sm font-semibold text-gray-900">
                Осипова Н.Н, метролог ООО «Газпром газнадзор»
              </cite>
            </div>
            <div class="relative">
              <div class="font-fancy relative rounded-2xl bg-violet-100 p-4 font-semibold text-gray-500 shadow">
                …благодарны за четкое соблюдение сроков договора, что было крайне важно для запуска новой лаборатории.
                <span
                  class="absolute -bottom-4 left-8 h-0 w-0 border-t-[16px] border-r-[16px] border-l-[16px] border-t-violet-100 border-r-transparent border-l-transparent"></span>
              </div>
              <cite class="mt-6 block pl-6 text-sm font-semibold text-gray-900">
                Михайлов А.Ю., инженер ОМТС ОАО «Транссибнефть»
              </cite>
            </div>
            <div class="relative">
              <div class="font-fancy relative rounded-2xl bg-violet-100 p-4 font-semibold text-gray-500 shadow">
                ...всегда удается найти общий язык, возникающие сложности оперативно решаются по первому обращению.
                <span
                  class="absolute -bottom-4 left-8 h-0 w-0 border-t-[16px] border-r-[16px] border-l-[16px] border-t-violet-100 border-r-transparent border-l-transparent"></span>
              </div>
              <cite class="mt-6 block pl-6 text-sm font-semibold">
                Гринь К.Е., специалист отдела поставок АО «Атомэнергомаш»
              </cite>
            </div>
            <div class="relative">
              <div class="font-fancy relative rounded-2xl bg-violet-100 p-4 font-semibold text-gray-500 shadow">
                ...после долгих проб и ошибок наконец-то нашли ответственного поставщика инструмента.
                <span
                  class="absolute -bottom-4 left-8 h-0 w-0 border-t-[16px] border-r-[16px] border-l-[16px] border-t-violet-100 border-r-transparent border-l-transparent"></span>
              </div>
              <cite class="mt-6 block pl-6 text-sm font-semibold">
                Шульц А. С., технолог ВРД Арчеда - филиал ООО «НВК»
              </cite>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="mb-4 text-2xl font-semibold text-violet-800">Наши преимущества</h3>
        <div class="grid gap-6 md:grid-cols-2">
          <HelperPresentationCard
            v-for="(adv, idx) in advantages"
            :key="idx"
            :item="adv" />
        </div>
      </div>

      <HelperAlarm>
        <template #title>Действует индивидуальная система скидок!</template>
        <p class="">
          Получите профессиональную консультацию и сделайте заказ у наших менеджеров по телефону
          <a
            href="tel:+73517907748"
            title="Позвонить"
            class="text-indigo-600 underline-offset-4 hover:underline"
            >+7 (351) 790-77-48</a
          >, электронной почте
          <a
            href="mailto:info@chelinstrument.ru"
            class="text-indigo-600 underline-offset-4 hover:underline"
            >info@chelinstrument.ru</a
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
