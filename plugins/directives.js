import { vMaska } from 'maska'
/*
 пример использования маски:
 const userPhone = reactive({
  data: '',
  complete: false
 })
<input v-mask.phone="userPhone.data" @maskData="userPhone.data = $event.detail.value" @maskComplete="userPhone.complete = $event.detail.value" type="text" placeholder="999 999-99-99">
})
 */

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      el.focus()
      // el.style.border = '2px solid red'
    },
  }),
    nuxtApp.vueApp.directive('maska', vMaska),
    nuxtApp.vueApp.directive('mask', {
      // delete?
      mounted(el, binding) {
        if (binding.modifiers.phone) var mask = '### ###-##-##'
        else if (binding.modifiers.code) var mask = '#####'
        else if (binding.modifiers.inn) var mask = '############'
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

            let complete = el.value.length === mask.length
            if (binding.modifiers.inn && el.value.length === 10) complete = true
            el.dispatchEvent(
              new CustomEvent('maskComplete', {
                detail: {
                  value: complete,
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
    }),
    nuxtApp.vueApp.directive('phoneMask', {
      // <input v-phone-mask="userPhone" @phoneMask="userPhone = $event.detail.value" type="text" placeholder="000 000-00-00">
      mounted(el, binding) {
        el.value = binding.value

        const handler = () => {
          console.log(`from handler`)
          try {
            const mask = '### ###-##-##'
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
              new CustomEvent('phoneMask', {
                detail: {
                  value: el.value,
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
    })
})
