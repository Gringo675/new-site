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
    <div class="flex my-1">
      <div
        v-for="tag in productData.subCats"
        class="px-2 mr-2 rounded-md bg-slate-300"
      >
        <NuxtLink :to="'/catalog/' + tag.alias">{{ tag.name }}</NuxtLink>
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
