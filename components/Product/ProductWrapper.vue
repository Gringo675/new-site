<script setup>
const props = defineProps({
  data: Object,
})

const productData = props.data

const breadCrumbs = useBreadCrumbs()
breadCrumbs.value = [
  {
    name: 'Каталог',
    link: '/catalog',
  },
  {
    name: productData.category.name,
    link: '/catalog/' + productData.category.alias,
  },
]
</script>

<template>
  <div class="">
    <!--    breadcrumbs-->
    <BreadCrumbs />
    <!--    subCats-->
    <h3>В категориях:</h3>
    <div class="my-1">
      <div
        v-for="subCat in productData.category.subCats"
        class="px-2"
      >
        <NuxtLink :to="'/catalog/' + subCat.alias">{{ subCat.name }}</NuxtLink>
        <div
          v-for="subSubCat in subCat.childs"
          class="px-2"
        >
          <NuxtLink :to="'/catalog/' + subSubCat.alias">{{ subSubCat.name }}</NuxtLink>
        </div>
      </div>
    </div>
    <!--    name + label  -->
    <div class="flex items-end">
      <h1>{{ productData.name }}</h1>
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
    <div v-for="image in productData.images">
      <img :src="'https://chelinstrument.ru/components/com_jshopping/files/img_products/' + image" />
    </div>
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

<style></style>
