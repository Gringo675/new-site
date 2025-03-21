<script setup>
const test = () => {
  // localStorage.setItem('user-event', Math.random().toString())
  const bbb = aaa * 2
}

const localVar = 111
const localFn = localWar => {
  console.log(`localWar: ${localWar}`)
}

const createMess = () => {
  showMessage({
    title: 'Some very big title with long long words about everything',
    description: 'some description',
    type: 'success',
    // preventClose: false,
    callback: () => localFn(localVar),
  })
}

const createFeedback = () => {
  showFeedback({
    title: 'Обратная связь',
    description: 'Воспользуйтесь данной формой, чтобы прислать Ваши вопросы, предложения, или отправить заявку.',
  })
}
// const url = useRequestURL()
// console.log(`url: ${JSON.stringify(url, null, 2)}`)
// console.log(`pathname: ${JSON.stringify(url.pathname, null, 2)}`)
// const route = useRoute()
// console.log(`route: ${JSON.stringify(route.fullPath, null, 2)}`)
</script>

<template>
  <div class="mx-auto max-w-screen-xl">
    <ClientOnly>
      <RecentlyViewed />
    </ClientOnly>

    <div class="bg-secondary-200">
      <div class="flex flex-wrap items-center gap-x-2 -md:hidden">
        <UButton
          label="Admin"
          to="/admin"
          color="secondary"
        />
        <UButton
          label="Create mess"
          @click="createMess"
          color="secondary"
        />
        <UButton
          label="Show loader"
          @click="showLoader"
          color="secondary"
        />
        <UButton
          label="Show notice"
          color="secondary"
          @click="showNotice({ title: 'some title', description: 'some description', type: 'success' })"
        />
        <UButton
          label="Show feedback"
          color="secondary"
          @click="createFeedback"
        />
        <!--      <button @click="multiply" class="button">Multuply</button>-->
      </div>
      <div class="flex flex-wrap items-center gap-x-2 -md:hidden">
        <UButton
          label="ШТАНГЕНЦИРКУЛИ"
          to="/catalog/shtangentsirkuli"
        />
        <UButton
          label="ШЦ с глубиномером"
          to="/catalog/shtangentsirkuli-shts-i-s-glubinomerom"
        />
        <UButton
          label="Orders"
          to="/user/orders"
        />
        <UButton
          label="test_fetch"
          to="/test_fetch"
        />
        <UButton
          label="test1"
          to="/test1"
        />
        <UButton
          label="test2"
          to="/test2"
        />

        <UButton
          label="test3"
          to="/test3"
        />
        <UButton
          label="test4"
          to="/test4"
        />
        <UButton
          label="test5"
          to="/test5"
        />
        <UButton
          label="TEST"
          @click="test"
        />
      </div>
    </div>
  </div>
</template>
