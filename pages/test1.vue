<script setup>

const aaa = 111

const getGoogleOAuthURL = () => {

  try {

    const config = useRuntimeConfig()
    const fullBaseUrl = window.location.origin + config.app.baseURL
    const googleRootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const options = {
      redirect_uri: fullBaseUrl + 'api/auth/oauth/google',
      client_id: config.GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ].join(' ')

    }
    const qs = new URLSearchParams(options)

    return `${googleRootUrl}?${qs.toString()}`

  } catch(e) {
    console.error(e)
  }
}

</script>

<template>
  <div>
    <h1>Test1</h1>
<!--    <button class="button" @click="getGoogleOAuthURL">Google OAuth</button>-->
    <a :href="getGoogleOAuthURL()" class="m-2 p-2 bg-blue-300 cursor-pointer">Google OAuth</a>
  </div>
</template>

