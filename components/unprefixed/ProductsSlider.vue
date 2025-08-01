<script setup>
//
defineProps({
  products: Array,
  label: String,
})
</script>

<template>
  <div class="">
    <!-- <HelperDivider
      v-if="label"
      :text="label" /> -->
    <div class="menu-scrollbar mt-6 mb-2 flex gap-2 overflow-x-auto pb-4 md:-mx-2">
      <CatalogProductCard
        v-for="prod in products"
        :prod="prod"
        class="@container w-120 min-w-50" />
    </div>
  </div>
</template>
