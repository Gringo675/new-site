<script setup>
//
const company = useCompany()
</script>

<template>
  <div class="bg-black-striped">
    <div
      class="max-xs:grid-cols-1 footer-links mx-auto grid max-w-screen-xl grid-cols-[2fr_1fr_1fr] gap-6 p-4 text-violet-200 max-lg:grid-cols-2"
    >
      <div class="flex flex-col items-start gap-1.5 max-lg:items-center">
        <NuxtLink to="/help">Как сделать заказ</NuxtLink>
        <NuxtLink to="/shipping">Доставка инструмента</NuxtLink>
        <NuxtLink to="/returns">Возврат товара</NuxtLink>
        <NuxtLink to="/warranty">Гарантия качества</NuxtLink>
        <NuxtLink to="/poverka">Поверка инструмента</NuxtLink>
      </div>

      <div class="flex flex-col gap-1.5 max-lg:items-center">
        <div class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-phone"
            class="size-5"
          />
          <NuxtLink :to="'tel:' + company.phones[0]">
            {{ company.phones[0] }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-envelope"
            class="size-5"
          />
          <NuxtLink :to="'mailto:' + company.mails[0]">
            {{ company.mails[0] }}
          </NuxtLink>
        </div>
        <div class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-home-modern"
            class="size-5"
          />
          <NuxtLink to="/contacts">
            {{ company.address.short }}
          </NuxtLink>
        </div>
        <UButton
          icon="i-heroicons-pencil-square"
          variant="outline"
          color="primary"
          block
          class="font-fancy mt-3 max-w-64 text-base font-bold text-violet-300 ring-violet-300/50"
          label="Задать вопрос"
          @click="showFeedback()"
        />
      </div>
      <div class="xs:max-lg:col-span-2 flex flex-col items-start text-sm text-violet-100/70 lg:-order-1 lg:max-w-110">
        <p class="text-lg">© ООО ТД "Челябинский Инструмент", 2000–2025</p>
        <p class="">Сайт использует файлы cookie, которые содержат информацию о предыдущих посещениях веб-сайта.</p>
        <p>Если вы не хотите использовать файлы cookie, измените настройки браузера.</p>
        <NuxtLink to="/about"> Информация на сайте не является публичной офертой </NuxtLink>
        <NuxtLink to="/about"> Политика конфиденциальности </NuxtLink>
      </div>
    </div>
  </div>
  <!-- <TheDebug /> -->
</template>
