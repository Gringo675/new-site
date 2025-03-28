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
    <h1 class="font-accent mb-2 mt-4 text-2xl leading-7 -xl:text-xl -xl:leading-6">{{ product.name }}</h1>
    <div class="flex">
      <div class="text-sm">Код товара:{{ product.id }}</div>
      <UButton
        :padded="false"
        :color="copied ? 'green' : 'gray'"
        variant="link"
        size="2xs"
        class="px-1"
        :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
        @click="copyId"
      />
    </div>
    <div class="my-1 border-b border-gray-200"></div>
    <div class="grid grid-cols-3 gap-4">
      <div class="col1 border border-stone-400 p-4">
        <imageViewerInline :images="product.images" />
      </div>
      <div class="col2">
        <!--    brand-->
        <div class="flex items-start gap-2">
          <div class="">Производитель: {{ product.brand.shortName }} ({{ product.brand.fullName }})</div>
          <img :src="brandImagesDirectory + product.brand.image" />
        </div>

        <!--    характеристики-->
        <div class="">
          <div
            v-for="prop in product.props"
            class=""
          >
            {{ prop.name }}: {{ prop.val }}
          </div>
        </div>
      </div>
      <div class="col3">
        <!--    price-->
        <div class="flex items-center gap-2">
          <div class="text-2xl">
            {{ (product.price * priceMultiplier).toLocaleString() + ' ₽' }}
          </div>
          <URadioGroup
            v-model="priceMultiplier"
            :options="priceOptions"
          />
        </div>
        <div class="my-4 w-28 shrink-0 grow-0">
          <ClientOnly>
            <CatalogCartButton :prod="product" />
            <template #fallback>
              <UButton
                label="В корзину"
                variant="outline"
                icon="i-heroicons-shopping-cart"
                class="gap-1"
              />
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <HelperDocsBlock :docs="product.docs" />

    <!--    related-->
    <div class="">
      <h2 class="py-2 text-lg font-semibold">Похожие товары</h2>
      <div class="grid grid-cols-4 gap-2 -xl:grid-cols-2 -sm:grid-cols-1">
        <CatalogProductCard
          v-for="prod in product.relatedProds"
          :prod="prod"
          class="@container"
        />
      </div>
    </div>
  </div>
</template>
