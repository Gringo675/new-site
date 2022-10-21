<script setup>
import useBreadCrumbs from "~/composables/state/useBreadCrumbs";

const props = defineProps({
  productData: Object
})

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
    <BreadCrumbs />
<!--    subCats-->
    <div class="flex my-1">
      <div v-for="tag in productData.subCats"
           class="px-2 mr-2 rounded-md bg-slate-300"
      >
        <NuxtLink :to="'/catalog/' + tag.alias">{{ tag.name }}</NuxtLink>
      </div>
    </div>
    <!--    name etc -->
    <h1>{{ productData.name }}</h1>
    <div>
      id: {{ productData.id }}
    </div>
    <div>
      Цена: {{ productData.price }}
    </div>
    <div>
      Производитель: {{ productData.p0_brand }}
    </div>
    <div>
      Тип: {{ productData.p1_type }}
    </div>
    <div>
      Система отсчета: {{ productData.p2_counting_system }}
    </div>
    <div>
      Диапазон: {{ productData.p3_range }}
    </div>
    <div>
      Размерность: {{ productData.p4_size }}
    </div>
    <div>
      Точность отсчета: {{ productData.p5_accuracy }}
    </div>
    <div>
      Класс: {{ productData.p6_class }}
    </div>
    <div>
      Особенность: {{ productData.p7_feature }}
    </div>
    <div>
      Упаковка: {{ productData.p8_pack }}
    </div>




    <div v-for="image in productData.images">
      <img :src="'https://chelinstrument.ru/components/com_jshopping/files/img_products/' + image">
    </div>
<!--    related-->
    <div class="">
      <h2>Похожие товары</h2>
      <div class="">
        <HelperProductCard v-for="prod in productData.relatedProds" :prod="prod" />

      </div>
    </div>
  </div>
</template>

<style>

</style>