<script setup>
//
const { data: product } = defineProps({
  data: Object,
})

useSeoMeta({
  title: product.name + ' - цена, фото, характеристики',
})

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

const copied = ref(false)
const copyId = () => {
  navigator.clipboard.writeText(product.id)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

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
      :productCats="subCats"
    />
    <h1 class="font-accent my-4 text-2xl leading-7 max-xl:text-xl max-xl:leading-6">{{ product.name }}</h1>
    <div class="relative flex w-fit">
      <div class="text-sm">Код: {{ product.id }}</div>
      <UButton
        :padded="false"
        :color="copied ? 'green' : 'gray'"
        variant="link"
        size="2xs"
        class="px-1"
        :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
        @click="copyId"
      />
      <HelperProductLabel
        v-if="product.label > 0"
        :labelId="product.label"
        forProduct
      />
    </div>
    <div class="my-1 border-b border-gray-200"></div>
    <div class="mb-6 grid grid-cols-3 grid-rows-[auto_1fr] gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <div class="bl1 sm:row-span-2">
        <imageViewerInline :images="product.images" />
      </div>
      <div class="bl2 flex items-start gap-2 p-2">
        <img
          class="max-w-32"
          :src="brandImagesDirectory + product.brand.image"
        />
        <div class="grow text-sm leading-tight font-semibold">
          {{ product.brand.shortName }} ({{ product.brand.fullName }})
        </div>
      </div>
      <div class="bl3 lg:row-span-2">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <div class="price my-6 flex items-center gap-4">
            <div class="relative">
              <div
                v-if="product.priceRegular"
                class="absolute right-0 bottom-full line-through opacity-70"
              >
                {{ product.priceRegular.toLocaleString() + ' ₽' }}
              </div>
              <div class="rounded-lg bg-green-100 px-2 py-1 text-2xl">
                {{ Math.round(product.price * priceMultiplier).toLocaleString() + ' ₽' }}
              </div>
            </div>
            <URadioGroup
              v-model="priceMultiplier"
              :options="priceOptions"
            />
          </div>
          <div class="buttons flex w-[280px] flex-col gap-5">
            <ProductCartButton :prod="product" />
            <UButton
              label="Быстрый заказ"
              variant="outline"
              icon="i-heroicons-pencil-square"
              @click="showFeedback"
              block
              size="xl"
              class=""
            />
          </div>
        </div>
        <NuxtLink
          to="/contacts"
          class="my-5 block rounded-lg border border-cyan-300 bg-cyan-50 p-3"
        >
          <div class="flex flex-wrap justify-end gap-x-2">
            <span>Самовывоз со склада в</span>
            <span class="text-blue-600 underline underline-offset-4">г. Челябинск.</span>
          </div>
          <div class="flex flex-wrap justify-end gap-x-2">
            <span>Доставка по России</span>

            <span class="text-blue-600 underline underline-offset-4">транспортными компаниями.</span>
          </div>
        </NuxtLink>
      </div>
      <div class="bl4 max-lg:xs:grid-cols-2 my-4 grid gap-x-4 gap-y-6 p-2 max-lg:sm:col-span-2">
        <div
          v-for="prop in product.props"
          class="relative rounded-lg border border-gray-300 bg-gray-200 px-3 py-1.5"
        >
          <div
            class="absolute -top-3 right-8 rounded-full border border-gray-300 bg-gray-200 px-2.5 py-1 text-sm leading-none after:absolute after:-inset-x-px after:top-1/2 after:-bottom-px after:bg-gray-200"
          >
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
      showDelivery
    />

    <!--    related-->
    <div class="">
      <h2 class="py-2 text-lg font-semibold">Похожие товары</h2>
      <div class="grid grid-cols-4 gap-2 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <CatalogProductCard
          v-for="prod in product.relatedProds"
          :prod="prod"
          class="@container"
        />
      </div>
    </div>
    <UAlert
      icon="i-heroicons-exclamation-circle"
      color="primary"
      variant="solid"
      class="my-5"
      title="Уважаемые покупатели, представленный ассортимент и стоимость продукции не являются окончательными."
      description="Уточняйте
      наличие и условия предоставления скидок у наших специалистов. Сотрудничая с нами, Вы получаете гарантию качества и
      точность исполнения заказа!"
    />
  </div>
</template>
