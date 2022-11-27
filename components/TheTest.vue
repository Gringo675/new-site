<script setup>

// import useUser from "../composables/user/useUser";
//
console.log(`!!!from test component!!!`)
// const user = useUser()
// if (!user.value.isAdmin) throw createError({ statusCode: 403, statusMessage: 'error 403'})


let {data, pending} = defineProps({
  data: Object,
  pending: Boolean
})
const aaa = JSON.stringify(data)

</script>

<template>
  <div class="TheTest">
THE TEST component <br>
    data: {{data}} <br>
    pending: {{pending}}
  </div>
</template>

