<script setup>
// блок для показа документации на странице категории и товара
const { docs } = defineProps({
  docs: Object,
})

const items = []
for (const stn of docs.stnd ?? []) {
  const item = {
    title: `${stn.number} ${stn.name}`,
    buttons: [],
  }
  if (stn.file) {
    item.buttons.push({
      label: `Открыть ${stn.number}`,
      url: `stnd/${stn.file}`,
    })
  }
  items.push(item)
}
for (const rstr of docs.rstr ?? []) {
  const item = {
    title: `Госреестр №${rstr.number} ${rstr.name}${rstr.type_si?.length > 1 ? ` тип - ${rstr.type_si}` : ''}${
      rstr.brand?.length > 1 ? ` Изготовитель: ${rstr.brand}.` : ''
    }${rstr.date?.length > 1 ? ` Срок свидетельства: ${parseIsoDate(rstr.date)}` : ''}`,
    buttons: [],
  }
  if (rstr.file_svid) {
    item.buttons.push({
      label: 'Открыть свидетельство об утверждении типа',
      url: `rstr/${rstr.file_svid}`,
    })
  }
  if (rstr.file_ot) {
    item.buttons.push({
      label: 'Открыть описание типа',
      url: `rstr/${rstr.file_ot}`,
    })
  }
  if (rstr.file_mp) {
    item.buttons.push({
      label: 'Открыть методику поверки',
      url: `rstr/${rstr.file_mp}`,
    })
  }
  items.push(item)
}
for (const pasp of docs.pasp ?? []) {
  const item = {
    title: pasp.name,
    buttons: [],
  }
  if (pasp.file) {
    item.buttons.push({
      label: 'Открыть паспорт',
      url: `pasp/${pasp.file}`,
    })
  }
  items.push(item)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <HelperDocsBlockItem
      v-for="item in items"
      :item="item" />
  </div>
</template>
