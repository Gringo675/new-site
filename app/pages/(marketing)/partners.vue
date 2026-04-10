<script setup>
useTitle('Партнеры')
</script>

<template>
  <article class="mx-4 my-8">
    <header class="mb-8">
      <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Партнеры</h1>
    </header>

    <section class="space-y-8">
      <p>
        Настоящим Реестром Партнеров определяется перечень лиц (контрагентов), которым Оператор ООО ТД «Челябинский
        Инструмент» вправе передавать персональные данные (предоставление, доступ) в целях исполнения заказов и
        обеспечения работы Сайта в соответствии с
        <NuxtLink
          to="/consent"
          class="text-indigo-600 underline-offset-4 hover:underline"
          >Согласием на обработку персональных данных</NuxtLink
        >.
      </p>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">Наименование юридического лица</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Цель сотрудничества</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2">ООО «БЕГЕТ», ИНН 7801451618</td>
              <td class="border border-gray-300 px-4 py-2">
                Предоставление места на сервере для размещения сайта и хранения базы данных
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">ООО «Служба доставки СДЭК», ИНН 7720933109</td>
              <td class="border border-gray-300 px-4 py-2">Оказание услуг по доставке товаров и корреспонденции</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">АО «Почта России», ИНН 7724490000</td>
              <td class="border border-gray-300 px-4 py-2">Оказание услуг по доставке товаров и корреспонденции</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">ООО «КАВАРУ-ЛОГИСТИК», ИНН 6678089737</td>
              <td class="border border-gray-300 px-4 py-2">Оказание услуг по доставке товаров и корреспонденции</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">ООО «Деловые линии», ИНН 7826156685</td>
              <td class="border border-gray-300 px-4 py-2">Оказание услуг по доставке товаров и корреспонденции</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">ООО «Байкал-Сервис ТК», ИНН 5001038736</td>
              <td class="border border-gray-300 px-4 py-2">Оказание услуг по доставке товаров и корреспонденции</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">ООО «ЖелДорЭкспедиция», ИНН 7718725461</td>
              <td class="border border-gray-300 px-4 py-2">Оказание услуг по доставке товаров и корреспонденции</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm text-gray-600">
        Оператор вправе изменять перечень Партнеров путем обновления настоящего Реестра без внесения изменений в
        Согласие на обработку персональных данных.
      </p>
    </section>
  </article>
</template>
