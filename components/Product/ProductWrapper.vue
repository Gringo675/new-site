<script setup>
const { data: productData } = defineProps({
  data: Object,
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
</script>

<template>
  <div class="">
    <BreadCrumbsWrapper
      :catId="productData.category_id"
      :productCats="subCats"
    />
    <!--    name + label  -->
    <div class="flex items-end">
      <h1 class="my-4">{{ productData.name }}</h1>
      <img
        v-if="productData.label"
        :src="'/img/labels/' + productData.label.image"
        class="w-12"
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
    <div class="max-w-[400px] border border-stone-400 m-4 p-4">
      <image-viewer-inline :images="productData.images" />
    </div>
    <HelperDocsBlock :docs="productData.docs" />

    <!--    related-->
    <div class="">
      <h2>Похожие товары</h2>
      <div class="">
        <CatalogProductCard
          v-for="prod in productData.relatedProds"
          :prod="prod"
        />
      </div>
    </div>
  </div>
</template>
