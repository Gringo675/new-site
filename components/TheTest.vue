<script setup>

// import useUser from "../composables/user/useUser";
//
console.log(`!!!from test component!!!`)
// const user = useUser()
// if (!user.value.isAdmin) throw createError({ statusCode: 403, statusMessage: 'error 403'})


let {data, pending} = defineProps({
  data: Object,
  pending: Object
})

console.log(`data: ${JSON.stringify(data, null, 2)}`)
console.log(`pending: ${JSON.stringify(pending, null, 2)}`)

// const aaa = JSON.stringify(data)

</script>

<template>
  <div class="TheTest">
THE TEST component <br>
<!--    data: {{data}} <br>-->
<!--    pending: {{pending}}-->
  </div>
</template>

