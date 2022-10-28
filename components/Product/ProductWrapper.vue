<script setup>
import useBreadCrumbs from "~/composables/state/useBreadCrumbs";

const props = defineProps({
  productData: Object
})
if (!props.productData) throw createError({statusCode: 404, statusMessage: 'Page Not Found!!!!', fatal: true})

const productData = props.productData

const breadCrumbs = useBreadCrumbs()
breadCrumbs.value = [
  {
    name: 'Каталог',
    link: '/catalog'
  },
  {
    name: productData.category.name,
    link: '/catalog/' + productData.category.alias
  }
]


</script>

<template>
  <div class="">
    <!--    breadcrumbs-->
    <BreadCrumbs/>
    <!--    subCats-->
    <div class="flex my-1">
      <div v-for="tag in productData.subCats"
           class="px-2 mr-2 rounded-md bg-slate-300"
      >
        <NuxtLink :to="'/catalog/' + tag.alias">{{ tag.name }}</NuxtLink>
      </div>
    </div>
    <!--    name  -->
    <h1>{{ productData.name }}</h1>
    <!--    id-->
    <div>
      id: {{ productData.id }}
    </div>
    <!--    brand-->
    <div class="flex items-center">
      <div class="">
        Производитель: {{ productData.brand.shortName }} ({{ productData.brand.fullName }})
      </div>
      <div class="ml-5">
        <img :src="'https://chelinstrument.ru/components/com_jshopping/files/img_manufs/' + productData.brand.image">
      </div>
    </div>
    <!--    price-->
    <div>
      Цена: {{ productData.price }}
    </div>
    <!--    характеристики-->
    <div class="">
      <div v-for="prop in productData.props"
           class=""
      >
        {{ prop.name }}: {{ prop.val }}
      </div>
    </div>
    <!--images-->
    <div v-for="image in productData.images">
      <img :src="'https://chelinstrument.ru/components/com_jshopping/files/img_products/' + image">
    </div>
    <!--    related-->
    <div class="">
      <h2>Похожие товары</h2>
      <div class="">
        <HelperProductCard v-for="prod in productData.relatedProds" :prod="prod"/>

      </div>
    </div>
  </div>
</template>

<style>

</style>