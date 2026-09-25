<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  doc: {
    type: Object,
    required: true,
  },
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: String,
    default: '',
  },
})

defineEmits(['close', 'feedback'])

// Products pagination
const productPage = ref(1)
const productPageSize = ref(10)
const productPageSizeOptions = [
  { label: '10 шт.', value: 10 },
  { label: '20 шт.', value: 20 },
  { label: '50 шт.', value: 50 },
]

const totalSelectedProducts = computed(() => props.products.length)

const paginatedProducts = computed(() => {
  const size = Number(productPageSize.value) || 10
  const start = (productPage.value - 1) * size
  return props.products.slice(start, start + size)
})

const productPageRangeText = computed(() => {
  if (totalSelectedProducts.value === 0) return '0 из 0'
  const size = Number(productPageSize.value) || 10
  const start = (productPage.value - 1) * size + 1
  const end = Math.min(productPage.value * size, totalSelectedProducts.value)
  return `${start}–${end} из ${totalSelectedProducts.value}`
})

watch(
  () => props.doc?.number,
  () => {
    productPage.value = 1
  },
)

watch(productPageSize, () => {
  productPage.value = 1
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="border-b border-slate-100 pb-3">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-base font-bold text-indigo-700 sm:text-lg">ГРСИ № {{ doc.number }}</span>
            <span
              v-if="doc.type_si"
              class="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              {{ doc.type_si }}
            </span>
          </div>
          <h3 class="mt-1.5 text-sm leading-snug font-bold text-slate-900 sm:text-base">
            {{ doc.name }}
          </h3>
          <p
            v-if="doc.brand"
            class="mt-1 text-xs text-slate-500">
            {{ doc.brand }}
          </p>
        </div>

        <!-- Action / Status on right -->
        <div class="shrink-0 text-right">
          <UButton
            v-if="isMobile"
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="$emit('close')" />
          <span
            v-else-if="doc.date"
            class="text-xs text-slate-500">
            Действует до {{ new Date(doc.date).toLocaleDateString('ru-RU') }}
          </span>
        </div>
      </div>

      <div
        v-if="isMobile && doc.date"
        class="mt-2 text-xs text-slate-500">
        Срок действия: до {{ new Date(doc.date).toLocaleDateString('ru-RU') }}
      </div>
    </div>

    <!-- Official Documents Links (Shown ONLY when documents exist) -->
    <div
      v-if="doc.file_ot?.uuid || doc.file_mp?.uuid"
      class="space-y-2">
      <h4 class="text-xs font-bold tracking-wider text-slate-400 uppercase">Официальные документы ФГИС</h4>
      <div
        class="grid gap-2"
        :class="doc.file_ot?.uuid && doc.file_mp?.uuid ? 'grid-cols-2' : 'grid-cols-1'">
        <a
          v-if="doc.file_ot?.uuid"
          :href="`/api/fgis/file/${doc.file_ot.uuid}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs transition hover:border-indigo-400 hover:bg-indigo-50/50 sm:p-3">
          <UIcon
            name="i-lucide-file-text"
            class="size-5 shrink-0 text-red-500 sm:size-6" />
          <div class="min-w-0">
            <div class="font-semibold text-slate-800">Описание типа</div>
            <div class="text-[10px] text-slate-400">PDF в новой вкладке</div>
          </div>
        </a>

        <a
          v-if="doc.file_mp?.uuid"
          :href="`/api/fgis/file/${doc.file_mp.uuid}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs transition hover:border-indigo-400 hover:bg-indigo-50/50 sm:p-3">
          <UIcon
            name="i-lucide-file-text"
            class="size-5 shrink-0 text-blue-500 sm:size-6" />
          <div class="min-w-0">
            <div class="font-semibold text-slate-800">Методика поверки</div>
            <div class="text-[10px] text-slate-400">PDF в новой вкладке</div>
          </div>
        </a>
      </div>
    </div>

    <!-- Catalog Products Marketing Showcase -->
    <div class="space-y-3 border-t border-slate-100 pt-3">
      <div class="flex items-center justify-between">
        <h4 class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
          <UIcon
            name="i-lucide-shopping-cart"
            class="size-4 text-emerald-600" />
          <span>Товары в каталоге</span>
        </h4>
        <span
          v-if="totalSelectedProducts"
          class="text-xs font-semibold text-emerald-700">
          {{ productPageRangeText }}
        </span>
      </div>

      <!-- Loading Spinner -->
      <div
        v-if="loading"
        class="py-6 text-center text-xs text-slate-400">
        Загрузка товаров из каталога...
      </div>

      <!-- Catalog Products List -->
      <template v-else-if="totalSelectedProducts > 0">
        <!-- Products Mini-Pagination Bar (Top, 1 line, no label) -->
        <div
          v-if="totalSelectedProducts > 10"
          class="flex items-center justify-between gap-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-1.5 text-xs">
          <USelect
            v-model="productPageSize"
            :items="productPageSizeOptions"
            size="xs"
            class="w-20 shrink-0" />

          <UPagination
            v-if="totalSelectedProducts > Number(productPageSize)"
            v-model:page="productPage"
            :items-per-page="Number(productPageSize)"
            :total="totalSelectedProducts"
            :sibling-count="1"
            size="xs" />
        </div>

        <div
          class="@container flex flex-col gap-y-2 py-1"
          :class="{
            'overflow-y-auto pr-1': Boolean(maxHeight),
          }"
          :style="maxHeight ? { maxHeight } : undefined">
          <CatalogProductCard
            v-for="prod in paginatedProducts"
            :key="prod.id"
            :prod="prod"
            class="shrink-0" />
        </div>
      </template>

      <!-- Fallback Banner when no products in catalog -->
      <div
        v-else
        class="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 sm:p-4">
        <div class="flex items-center gap-1.5 font-bold">
          <UIcon
            name="i-heroicons-information-circle"
            class="size-4 text-amber-600" />
          <span>Точного соответствия в каталоге нет</span>
        </div>
        <p class="leading-relaxed text-amber-800">Оставьте заявку — оперативно уточним возможность поставки или подберём аналог.</p>
        <UButton
          size="xs"
          color="warning"
          variant="subtle"
          label="Оставить заявку"
          class="w-full justify-center"
          @click="$emit('feedback')" />
      </div>
    </div>
  </div>
</template>
