<script setup>
//
const { data: product } = defineProps({
  data: Object,
})

useTitle(product.name + ' - цена, фото, характеристики')

const brandImagesDirectory = useRuntimeConfig().public.IMAGES_DIRECTORY + 'img_manufs/'

// формируем вложенные категории, в которых присутствует товар
const { data: cats } = await useCats()
const subCats = cats.value
  .find(cat => cat.id === product.category_id)
  .children.filter(subCat => product.subCatsId.includes(subCat.id))
  .map(subCat => {
    return {
      alias: subCat.alias,
      name: subCat.name,
      children: subCat.children
        ?.filter(subSubCat => product.subCatsId.includes(subSubCat.id))
        .map(subSubCat => {
          return { alias: subSubCat.alias, name: subSubCat.name }
        }),
    }
  })

onMounted(() => {
  setTimeout(() => {
    const addToViewed = useAddToViewed()
    addToViewed.value = {
      id: product.id,
      alias: product.alias,
      name: product.name,
      image: product.images[0],
      price: product.price,
      priceRegular: product.priceRegular,
      label: product.label,
    }
  }, 2000)
})

const priceOptions = [
  {
    value: 1,
    label: 'без НДС',
  },
  {
    value: 1.2,
    label: 'с НДС',
  },
]
const priceMultiplier = ref(1)
</script>

<template>
  <div class="">
    <BreadCrumbsWrapper
      :catId="product.category_id"
      :productCats="subCats" />
    <h1 class="font-accent my-4 text-2xl leading-7 max-xl:text-xl max-xl:leading-6">{{ product.name }}</h1>
    <div class="flex items-center gap-2">
      <UIcon
        name="i-material-symbols-barcode"
        class="size-6 shrink-0" />
      <div class="shrink-0 text-lg/[17px] font-bold">{{ product.id }}</div>
      <HelperProductLabel
        v-if="product.label > 0"
        :labelId="product.label"
        forProduct />
    </div>
    <div class="my-1 border-b border-gray-200"></div>
    <div class="mb-6 grid grid-cols-3 grid-rows-[auto_1fr] gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <div class="sm:row-span-2">
        <imageViewerInline :images="product.images" />
        <!-- <TheTest2 :images="product.images" /> -->
      </div>
      <div class="flex items-start gap-2 p-2">
        <img
          class="max-w-32"
          :src="brandImagesDirectory + product.brand.image" />
        <div class="grow text-sm leading-tight font-semibold">
          {{ product.brand.shortName }} ({{ product.brand.fullName }})
        </div>
      </div>
      <div class="lg:row-span-2">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <div
            class="relative my-5 shrink-0 grow-0 rounded-2xl bg-slate-400 px-4 py-2 text-2xl leading-none whitespace-nowrap text-slate-50">
            <span class=""> {{ Math.round(product.price * priceMultiplier).toLocaleString() + ' ₽' }}</span>
            <div
              v-if="product.priceRegular"
              class="absolute -top-4 right-3 rounded-full bg-gradient-to-b from-fuchsia-400 to-fuchsia-300 px-2 py-1 text-sm leading-none line-through">
              {{ Math.round(product.priceRegular * priceMultiplier).toLocaleString() + ' ₽' }}
            </div>
          </div>
          <URadioGroup
            v-model="priceMultiplier"
            :items="priceOptions" />

          <div class="buttons flex w-70 flex-col gap-5">
            <ProductCartButton :prod="product" />
            <UButton
              label="Быстрый заказ"
              variant="outline"
              icon="i-heroicons-pencil-square"
              @click="
                showFeedback({
                  title: 'Быстрый заказ',
                  description: 'Оставьте заявку на товар, и мы свяжемся с Вами для уточнения деталей.',
                  message: `Я хочу заказать товар: ${product.name} (артикул ${product.id}) - 1 шт.`,
                })
              "
              block
              size="xl"
              class="font-fancy font-bold" />
          </div>
        </div>
        <NuxtLink
          to="/contacts"
          class="my-5 block rounded-lg border border-indigo-300 bg-indigo-50 p-3">
          <div class="flex flex-wrap justify-end gap-x-2">
            <span>Самовывоз со склада в</span>
            <span class="text-indigo-500 underline underline-offset-4">г. Челябинск.</span>
          </div>
          <div class="flex flex-wrap justify-end gap-x-2">
            <span>Доставка по России</span>

            <span class="text-indigo-500 underline underline-offset-4">транспортными компаниями.</span>
          </div>
        </NuxtLink>
      </div>
      <div class="bl4 max-lg:xs:grid-cols-2 my-4 grid items-start gap-x-4 gap-y-6 p-2 max-lg:sm:col-span-2">
        <div
          v-for="prop in product.props"
          class="relative rounded-lg border border-gray-300 bg-gray-200 px-3 py-1.5">
          <div
            class="absolute -top-3 right-8 rounded-full border border-gray-300 bg-gray-200 px-2.5 py-1 text-sm leading-none after:absolute after:-inset-x-px after:top-1/2 after:-bottom-px after:bg-gray-200">
            <span class="relative -top-0.5 z-10 font-semibold">{{ prop.name }}</span>
          </div>
          <div class="relative z-10 leading-tight">{{ prop.val }}</div>
        </div>
      </div>
    </div>

    <HelperInfoBlock
      :description="product.description"
      :characteristics="product.characteristics"
      :documentation="product.docs"
      showDelivery />

    <HelperAlarm>
      <template #title>
        Уважаемые покупатели, представленный ассортимент и стоимость продукции не являются окончательными!
      </template>
      <p>
        Уточняйте наличие и условия предоставления скидок у наших специалистов. Возможен индивидуальный подбор аналогов
        и комплектация заказа под Ваши задачи.
      </p>
      <p>Сотрудничая с нами, Вы получаете гарантию качества и точность исполнения заказа!</p>
    </HelperAlarm>
    <ProductsSlider
      v-if="product.relatedProds.length"
      :products="product.relatedProds"
      label="Похожие товары" />
  </div>
</template>
