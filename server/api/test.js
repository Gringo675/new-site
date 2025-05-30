// import { h, createApp } from 'vue'
// import { renderToString } from 'vue/server-renderer'
// import { compile } from '@vue/compiler-sfc'

// export default defineEventHandler(async event => {
//   const vueFile = `
//     <script setup>
//     const message = 'Hello from Vue!'
//     </script>

//     <template>
//       <div class="some-class">{{ message }}</div>
//     </template>

//     <style scoped>
//     .some-class {
//       color: blue;
//     }
//     </style>
//   `

//   // Parse SFC
//   const { descriptor } = compile(vueFile)

//   // Create component
//   const component = {
//     setup() {
//       // Execute setup script
//       const setupScript = new Function('vue', descriptor.script.content)
//       return setupScript({ h })
//     },
//     template: descriptor.template.content,
//   }

//   // Create app instance and mount component
//   const app = createApp(component)
//   const vNode = h(component)

//   // Render to HTML string
//   const html = await renderToString(vNode)

//   // Include scoped styles if present
//   const styles = descriptor.styles.map(style => style.content).join('\n')

//   return `
//     <style>${styles}</style>
//     ${html}
//   `
// })

import { h } from 'vue'
import { renderToString } from 'vue/server-renderer'
// import Email from '../template/Email.vue'

export default defineEventHandler(async event => {
  const vueFile = `
    <script setup>
    //
    const name = 'John Doe'
    </script>

    <template>
      <div class="some-class">Hellooows, {{ name }}!!!</div>
    </template>
  `

  const vNode = h(vueFile)

  const html = await renderToString(vNode)

  return html
})
