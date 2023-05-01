<script setup>
const aaa = ref('9517753408')

const vMyDir = {
  mounted(el, binding) {
    console.log(`from mounted`)

    const handler = () => {
      console.log(`from handler`)

      // const el = event.target
      el.dispatchEvent(
        new CustomEvent('myEvent', {
          detail: {
            someData: 999,
          },
        })
      )
    }
    handler()
    el.addEventListener('input', handler)
  },
}

const vMask2 = {
  mounted(el, binding) {
    if (binding.modifiers.phone) var mask = '### ###-##-##'
    else if (binding.modifiers.code) var mask = '#####'
    else return

    el.value = binding.value

    const handler = () => {
      try {
        const digitVal = el.value.replace(/\D/g, '')

        const caretPosition = el.selectionEnd
        const isCaretInEnd = caretPosition === el.value.length

        let di = 0 // digitVal index
        let newVal = ''
        if (digitVal.length) {
          for (let i = 0; i < mask.length; i++) {
            const symb = mask[i]
            if (symb === '#') {
              newVal += digitVal[di++]
              if (digitVal[di] === undefined) break // больше нет цифр
            } else newVal += symb
          }
        }

        if (el.value !== newVal) {
          el.value = newVal
          if (!isCaretInEnd) {
            el.setSelectionRange(caretPosition, caretPosition)
          }
        }

        el.dispatchEvent(
          new CustomEvent('maskData', {
            detail: {
              value: el.value,
            },
          })
        )
        el.dispatchEvent(
          new CustomEvent('maskComplete', {
            detail: {
              value: el.value.length === mask.length,
            },
          })
        )
      } catch (e) {
        console.error(`mask error: ${e.message}`)
      }
    }

    handler()
    el.addEventListener('input', handler)
  },
}

const userPhone = reactive({
  data: '7867688',
  complete: false,
})
const bbb = ref(false)

const ccc = ref('222')

const fff = (event) => {
  console.log(`from fff`)
  console.log(`event: ${JSON.stringify(event, null, 2)}`)
}
</script>

<template>
  <div>
    <h1>Test2</h1>
    <div
      class="m-3"
      style="display: flex; color: red"
    >
      <input
        v-mask.phone="userPhone.data"
        @maskData="userPhone.data = $event.detail.value"
        @maskComplete="userPhone.complete = $event.detail.value"
        type="text"
        placeholder="999 999-99-99"
      />
      <div>{{ userPhone }}</div>
    </div>
    <!-- <div class="m-3">
      <input v-my-dir @myEvent="fff($event.detail)" type="text">
      <div> {{ bbb }}</div>
      <div> {{ ccc }}</div>
    </div> -->
  </div>
</template>
