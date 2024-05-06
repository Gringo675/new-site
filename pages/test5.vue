<script setup>
//
// definePageMeta({
//   layout: 'empty',
// })

const images = [
  'shc-i-stiz_1.jpg',
  'SHC1STIZ.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
]

const images2 = ['0.jpg', '1.jpg', '2.jpg', '3.jpg']

// setTimeout(() => {
//   test1()
// }, 100)
const test1 = () => {
  showImageViewer(images, 3, 600, 600)
}
const test2 = () => {
  // get 2 elements of array
  showImageViewer(images.slice(0, 2), 1)
}
const test3 = () => {
  // get first element
  showImageViewer(images[0])
}
</script>

<template>
  <div class="buttons m-4">
    <UButton
      label="show all"
      @click="test1"
    />
    <UButton
      label="show two"
      @click="test2"
    />
    <UButton
      label="show first"
      @click="test3"
    />
  </div>
  <div class="max-w-[400px] border border-stone-400 m-4 p-4">
    <image-viewer-inline
      :images="images"
      lite
    />
  </div>
  <div class="max-w-[400px] border border-stone-400 m-4 p-4">
    <image-viewer-inline :images="images[0]" />
  </div>
  <div>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
  </div>
  <div class="float-right max-w-[400px] border border-stone-400 m-4 p-4">
    <image-viewer-inline :images="images" />
  </div>
  <div>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis fugit culpa labore. Qui exercitationem, soluta
    incidunt commodi vel minima temporibus alias quas ipsum odit ad voluptatem laudantium nisi! Fuga, cupiditate. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. A quisquam itaque obcaecati, provident cumque quaerat at cum
    excepturi optio numquam suscipit architecto reprehenderit similique unde repellendus quis odio! Voluptate, sunt.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi natus explicabo eaque esse, blanditiis non
    labore dicta assumenda laudantium accusantium saepe nihil recusandae provident rerum, quibusdam culpa inventore hic?
  </div>
</template>
