<script setup>

// import myFetch from "~/composables/common/myFetchOld"
import dataFetch from "~/composables/common/dataFetch"

const route = useRoute()
const url = '/api/apiTest'
const {data, pending} = await dataFetch(url, {
  lazy: true,
  auth: false,
  from: route.path
})


</script>

<template>
  <div class="test_fetch">
<!--    test: {{test.data ? test.data : ''}}-->
    <HelperInlineLoader v-if="pending"/>
    <TheTest v-else :data="data" :pending="pending"/>
    <!--    <Transition name="page" mode="out-in">-->
    <!--      <HelperInlineLoader v-if="pending"/>-->
    <!--      <TheTest v-else />-->
    <!--      <TheTest v-if="!pending && !error"/>-->
    <!--      <HelperInlineLoader v-else />-->
    <!--    </Transition>-->
  </div>
</template>

<style>

</style>