<script setup>
const { data: productData } = defineProps({
  data: Object,
})

useSeoMeta({
  title: productData.name + ' - цена, фото, характеристики',
})
// формируем вложенные категории, в которых присутствует товар
const { data: cats } = await useCats()
const subCats = cats.value
  .find(cat => cat.id === productData.category_id)
  .children.filter(subCat => productData.subCatsId.includes(subCat.id))
  .map(subCat => {
    return {
      alias: subCat.alias,
      name: subCat.name,
      children: subCat.children
        ?.filter(subSubCat => productData.subCatsId.includes(subSubCat.id))
        .map(subSubCat => {
          return { alias: subSubCat.alias, name: subSubCat.name }
        }),
    }
  })

onMounted(() => {
  setTimeout(() => {
    const addToViewed = useAddToViewed()
    addToViewed.value = {
      id: productData.id,
      alias: productData.alias,
      name: productData.name,
      image: productData.images[0],
      price: productData.price,
      priceRegular: productData.priceRegular,
      label: productData.label,
    }
  }, 2000)
})
</script>

<template>
  <div class="">
    <BreadCrumbsWrapper
      :catId="productData.category_id"
      :productCats="subCats"
    />
    <!--    name + label  -->
    <div class="relative w-max">
      <h1 class="my-4">{{ productData.name }}</h1>
      <CatalogProductCardLabel
        v-if="productData.label > 0"
        :labelId="productData.label"
      />
    </div>
    <!--    id-->
    <div>id: {{ productData.id }}</div>
    <!--    brand-->
    <div class="flex items-center">
      <div class="">Производитель: {{ productData.brand.shortName }} ({{ productData.brand.fullName }})</div>
      <div class="ml-5">
        <img :src="'https://chelinstrument.ru/components/com_jshopping/files/img_manufs/' + productData.brand.image" />
      </div>
    </div>
    <!--    price-->
    <div>
      Цена: {{ productData.price }}
      <sup v-if="productData.priceRegular">
        <del>{{ productData.priceRegular }}</del></sup
      >
      руб. без НДС
    </div>
    <!-- to cart -->
    <ClientOnly>
      <ProductCartButton :prod="productData" />
    </ClientOnly>
    <!--    характеристики-->
    <div class="">
      <div
        v-for="prop in productData.props"
        class=""
      >
        {{ prop.name }}: {{ prop.val }}
      </div>
    </div>
    <!--images-->
    <div class="m-4 max-w-[400px] border border-stone-400 p-4">
      <image-viewer-inline :images="productData.images" />
    </div>
    <HelperDocsBlock :docs="productData.docs" />

    <!--    related-->
    <div class="">
      <h2 class="py-2 text-lg font-semibold">Похожие товары</h2>
      <div class="grid grid-cols-4 gap-2 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <CatalogProductCard
          v-for="prod in productData.relatedProds"
          :prod="prod"
          class="@container"
        />
      </div>
    </div>
  </div>
</template>
