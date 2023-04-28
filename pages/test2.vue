<script setup>

const vMask = (el, binding) => {

  try {

    if (binding.modifiers.phone) var mask = '### ###-##-##'
    else if (binding.modifiers.code) var mask = '#####'
    else return

    const elVal = el.value
    const digitVal = el.value.replace(/\D/g, "")

    const caretPosition = el.selectionEnd
    const isCaretInEnd = caretPosition === elVal.length

    let di = 0 // digital index
    let newVal = ''
    for (let i = 0; i < mask.length; i++) {
      const symb = mask[i]
      if (symb === '#') {
        if (digitVal[di] === undefined) break
        else {
          newVal += digitVal[di++]
          if (digitVal[di] === undefined) break // больше нет цифр
        }
      }
      else newVal += symb
    }

    if (elVal !== newVal) {
      el.value = newVal
      if (!isCaretInEnd) {
        const newCaretPosition = caretPosition + newVal.length - elVal.length
        el.setSelectionRange(caretPosition, caretPosition)
      }
      el.dispatchEvent(new CustomEvent('input'))
    }

  } catch (e) {
    console.error(`mask error: ${e.message}`)
  }
}

const aaa = ref('')

const bbb = ref('2-3')

</script>

<template>
  <div>
    <h1>Test2</h1>
    <div class="m-3">
      <input v-mask.code v-model="aaa" type="text" placeholder="999 999-99-99">
      <div> {{ aaa }}</div>
    </div>
  </div>
</template>